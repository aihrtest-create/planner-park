import TelegramBot from 'node-telegram-bot-api';
import { statements } from '../database.js';

let bot = null;

const CONFIGURATOR_URL = process.env.CONFIGURATOR_URL || 'https://aihrtest-create.github.io/planner-park/';

/**
 * Генерирует текст приветственного сообщения (выглядит как от реального человека)
 */
function getWelcomeMessage(name) {
  const greetings = [
    `Здравствуйте, ${name}! 😊\n\nМеня зовут Анна, я банкетный менеджер Hello Park. Спасибо за вашу заявку на проведение дня рождения!\n\nЯ подготовила для вас персональный конфигуратор праздника — с его помощью вы сможете выбрать формат, квесты, шоу-программы, меню и все остальные детали.\n\nНажмите на кнопку ниже, чтобы начать 👇`,
    `Добрый день, ${name}! 🎉\n\nЭто Анна из Hello Park. Рада, что вы выбрали нас для проведения праздника!\n\nСпециально для вас подготовлен конфигуратор — вы сможете собрать идеальный день рождения, выбрав все опции по вкусу.\n\nНажмите кнопку ниже, чтобы начать оформление 👇`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Инициализация Telegram бота
 */
export function initTelegramBot() {
  const token = process.env.TG_BOT_TOKEN;
  if (!token || token === 'your_telegram_bot_token_here') {
    console.log('[TG BOT] ⚠️  Telegram токен не настроен. Бот не запущен.');
    return null;
  }

  const serverUrl = process.env.SERVER_URL;
  const useWebhook = serverUrl && !serverUrl.includes('localhost');

  if (useWebhook) {
    bot = new TelegramBot(token);
    const webhookUrl = `${serverUrl}/webhook/telegram`;
    bot.setWebHook(webhookUrl).then(() => {
      console.log(`[TG BOT] ✅ Webhook установлен: ${webhookUrl}`);
    }).catch(err => {
      console.error('[TG BOT] ❌ Ошибка установки webhook:', err.message);
    });
  } else {
    bot = new TelegramBot(token, { polling: true });
    console.log('[TG BOT] ✅ Запущен в режиме Long Polling (dev)');
  }

  // Handle /start command with lead ID payload
  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const payload = match[1]; // lead ID from deeplink

    if (!payload) {
      // Пользователь нажал /start без параметров
      await bot.sendMessage(chatId, 
        'Здравствуйте! 👋\n\nЯ — ассистент Hello Park. Чтобы начать оформление праздника, оставьте заявку на нашем сайте, и я пришлю вам персональный конфигуратор!',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🌐 Перейти на сайт', url: CONFIGURATOR_URL }
            ]]
          }
        }
      );
      return;
    }

    // Payload содержит ID лида
    const leadId = payload.replace('lead_', '');
    const lead = statements.getLead.get(leadId);

    if (!lead) {
      await bot.sendMessage(chatId, 
        'Извините, не удалось найти вашу заявку. Пожалуйста, попробуйте ещё раз через сайт.'
      );
      return;
    }

    // Связываем бота с лидом
    statements.connectBot.run(String(chatId), msg.from.username || '', leadId);
    statements.addEvent.run(leadId, 'telegram_connected', JSON.stringify({
      chat_id: chatId,
      username: msg.from.username,
      first_name: msg.from.first_name,
    }));

    // Отправляем приветствие + кнопку с конфигуратором
    const configUrl = `${CONFIGURATOR_URL}?lead=${leadId}`;
    const welcomeText = getWelcomeMessage(lead.name);

    await bot.sendMessage(chatId, welcomeText, {
      reply_markup: {
        inline_keyboard: [[
          { text: '🎂 Собрать праздник', url: configUrl }
        ]]
      }
    });

    // Обновляем статус
    statements.markLinkSent.run(leadId);
    statements.addEvent.run(leadId, 'link_sent_telegram', JSON.stringify({ configUrl }));

    console.log(`[TG BOT] Ссылка отправлена: ${lead.name} [${leadId}] → chat ${chatId}`);
  });

  // Handle any other messages
  bot.on('message', async (msg) => {
    if (msg.text && msg.text.startsWith('/start')) return; // Already handled above

    const chatId = msg.chat.id;
    
    // Check if this chat is linked to a lead
    const lead = statements.getLeadByChat.get(String(chatId), 'telegram');

    if (lead && lead.status === 'submitted') {
      await bot.sendMessage(chatId, 
        'Спасибо за ваше сообщение! Менеджер свяжется с вами в ближайшее время для подтверждения деталей праздника. 🎉'
      );
    } else if (lead) {
      const configUrl = `${CONFIGURATOR_URL}?lead=${lead.id}`;
      await bot.sendMessage(chatId, 
        'Если вы ещё не заполнили конфигуратор, нажмите на кнопку ниже 👇',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🎂 Собрать праздник', url: configUrl }
            ]]
          }
        }
      );
    } else {
      await bot.sendMessage(chatId, 
        'Здравствуйте! Чтобы начать оформление праздника, оставьте заявку на нашем сайте.',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🌐 Перейти на сайт', url: CONFIGURATOR_URL }
            ]]
          }
        }
      );
    }
  });

  return bot;
}

/**
 * Отправить уведомление клиенту в Telegram
 */
export async function notifyTelegramUser(chatId, message, keyboard = null) {
  if (!bot) return;
  
  const options = {};
  if (keyboard) {
    options.reply_markup = { inline_keyboard: keyboard };
  }
  
  try {
    await bot.sendMessage(chatId, message, options);
  } catch (error) {
    console.error(`[TG BOT] Ошибка отправки в чат ${chatId}:`, error.message);
  }
}

/**
 * Получить инстанс бота для webhook обработки
 */
export function getTelegramBot() {
  return bot;
}
