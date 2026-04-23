import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import leadsRouter from './routes/leads.js';
import { initTelegramBot, getTelegramBot } from './bots/telegram.js';
import { initMaxBot } from './bots/max.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// ---- Middleware ----
app.use(cors({
  origin: [
    'https://aihrtest-create.github.io',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

// ---- API Routes ----
app.use('/api/leads', leadsRouter);

// ---- Telegram Webhook ----
app.post('/webhook/telegram', (req, res) => {
  const bot = getTelegramBot();
  if (bot) {
    bot.processUpdate(req.body);
  }
  res.sendStatus(200);
});

// ---- Dashboard ----
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});
app.get('/dashboard/app.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard-app.js'));
});

// ---- Landing page ----
app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'landing.html'));
});

// ---- Health check ----
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`\n🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📊 Менеджер-панель: http://localhost:${PORT}/dashboard`);
  console.log(`📄 Лендинг: http://localhost:${PORT}/landing`);
  console.log(`🔗 API: http://localhost:${PORT}/api/leads\n`);

  // Initialize bots
  initTelegramBot();
  initMaxBot();
});
