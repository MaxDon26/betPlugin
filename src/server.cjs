const express = require("express");
const Pusher = require("pusher");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Загружаем переменные из .env

const app = express();
app.use(cors());
app.use(express.json());

// Настраиваем Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true, // Используем безопасное соединение
});

// Эндпоинт для отправки сообщений
app.post("/send-message", (req, res) => {
  // Отправляем событие в Pusher
  pusher.trigger("chat", "new-message", req.body);

  res.json({ success: true, message: "Сообщение отправлено!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
