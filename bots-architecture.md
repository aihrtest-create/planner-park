# Архитектура кроссплатформенных ботов (Telegram + Max) на Timeweb

В этом документе описано техническое решение для создания единого бэкенда на Node.js, который одновременно обслуживает ботов в Telegram и Max, связывает их с веб-лендингом и CRM-панелью, а также учитывает сетевые особенности хостинга в РФ.

## 1. Общая архитектура

- **Сервер:** Node.js + Express.js. Запускается на VPS (Timeweb) с помощью `pm2`.
- **База данных:** SQLite (локальный файл `database.sqlite`). Хранит заявки (лиды) и привязанные к ним `chat_id`.
- **Веб-сервер:** Nginx. Используется как reverse-proxy для перенаправления портов (80/443 -> 3001).
- **SSL Сертификат:** Let's Encrypt. Для Webhook и корректной работы браузеров (чтобы не было ошибки Mixed Content) обязательно нужен HTTPS. Если нет своего домена, используется бесплатный сервис `nip.io` (например, `194-87-118-33.nip.io`).

## 2. Связка сайта, CRM и ботов (Механика Deeplink)

Главная сложность при работе с ботами — понять, какой именно клиент с сайта сейчас нажал "Старт" в боте. Это решается через диплинки (deeplinks):

1. Клиент оставляет телефон на лендинге. Сайт отправляет POST-запрос на сервер.
2. Сервер создает в БД заявку с уникальным ID (например, `lead_A1B2C3`).
3. Сайт показывает клиенту ссылки на ботов с параметром start:
   - Telegram: `https://t.me/bot_name?start=lead_A1B2C3`
   - Max: `https://max.ru/bot_name?start=lead_A1B2C3`
4. Когда клиент переходит и нажимает "Старт", бот получает этот `lead_A1B2C3`.
5. Сервер находит заявку в БД и записывает в нее `chat_id` и `messenger_type` клиента.
6. Теперь CRM знает, куда отправлять сообщения менеджеру (так как каждый чат привязан к конкретному лиду).

## 3. Telegram Бот

**Библиотека:** `node-telegram-bot-api`
**Метод работы:** `Long Polling` (Долгий опрос)

### Почему не Webhook?

Серверы Telegram находятся за рубежом. Из-за особенностей маршрутизации, блокировок РКН и систем защиты от DDoS на российских хостингах (таких как Timeweb), входящие соединения от Telegram (Webhook) часто отваливаются по таймауту (`Connection timed out`).
При **Long Polling** наш сервер сам инициирует исходящее соединение к Telegram. Исходящий трафик не блокируется, поэтому бот работает стабильно и без сбоев.

*Пример инициализации:*

```javascript
const bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });
// Обязательно удаляем вебхук, чтобы не было конфликтов
bot.deleteWebHook().catch(() => {});
```

## 4. Бот платформы Max (ex. VK)

**Библиотека:** `@maxhub/max-bot-api` + прямые REST запросы (через `fetch`).
**Метод работы:** `Webhook`

### Почему не Long Polling?

Платформа Max вводит жесткие ограничения на Long Polling (максимум 2 запроса в секунду, строгие лимиты на батчи). При большом количестве пользователей бот начнет тормозить. Так как серверы Max и наш VPS находятся в РФ, проблем с входящими соединениями нет. Webhook работает идеально и моментально.

*Настройка Webhook для Max:*

1. В Express.js создается роут:

```javascript
app.post('/webhook/max', (req, res) => {
  bot.handleUpdate(req.body); // передаем событие в SDK бота
  res.sendStatus(200);
});
```

1. При запуске сервера делаем POST запрос к API Max для подписки на этот роут:

```javascript
fetch('https://botapi.max.ru/subscriptions', {
  method: 'POST',
  headers: { 'Authorization': token, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://ВАШ-IP.nip.io/webhook/max',
    events: ['bot_started', 'message_created']
  })
});
```

## 5. Единый интерфейс отправки сообщений (CRM)

Чтобы в коде CRM (админки) не приходилось писать логику под каждого бота, на бэкенде создается единый endpoint.

```javascript
router.post('/leads/:id/message', async (req, res) => {
  const lead = db.getLead(req.params.id);
  const { text } = req.body;

  if (lead.messenger === 'max') {
    await sendMaxMessage(lead.chat_id, text);
  } else if (lead.messenger === 'telegram') {
    await sendTelegramMessage(lead.chat_id, text);
  }
  
  res.json({ success: true });
});
```

### Отправка медиафайлов

- **Telegram** отлично работает через простые методы библиотеки `bot.sendPhoto()`, `bot.sendDocument()`.
- **Max** требует двухшаговой загрузки: сначала файл загружается через `FormData` на `https://botapi.max.ru/uploads`. В ответ приходит объект загруженного файла, который затем прикрепляется к массиву `attachments` в методе отправки сообщения `https://botapi.max.ru/messages`.

## 6. Чек-лист деплоя на новый VPS (Timeweb)

1. Установить Node.js, Nginx, PM2 и Git.
2. Склонировать проект и выполнить `npm install` в папке сервера.
3. Настроить бесплатный SSL сертификат (без покупки домена):
   `apt install certbot python3-certbot-nginx`
   `certbot --nginx -d ВАШ_IP.nip.io`
4. Прописать в конфигурации Nginx (`/etc/nginx/sites-available/default`) проксирование с 443 порта на порт Node.js (например, 3001).
5. Создать файл `.env` с ключами ботов и `SERVER_URL=https://ВАШ_IP.nip.io`.
6. Запустить сервер через `pm2 start index.js --name bot-server`.
