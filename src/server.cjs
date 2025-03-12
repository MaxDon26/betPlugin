const express = require("express");
const Pusher = require("pusher");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Загружаем переменные из .env

const app = express();
app.use(cors());
app.use(express.json());

let activeSessionId = null;

app.post("/api/register-session", (req, res) => {
  const { sessionId } = req.body;
  activeSessionId = sessionId;
  console.log(sessionId);
  res.status(200).send({ message: "Сессия зарегистрирована" });
});

// Удаление сессии при закрытии
app.post("/api/unregister-session", (req, res) => {
  const { sessionId } = req.body;
  if (activeSessionId === sessionId) {
    activeSessionId = null;
  }
  res.status(200).send({ message: "Сессия завершена" });
});

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
  const incomingSessionId = req.headers["x-session-id"];
  // Отправляем событие в Pusher
  console.log(req.headers);
  if (!incomingSessionId === activeSessionId)
    return res.status(401).json({ message: "no auth" });
  // Отправляем событие в Pusher
  // pusher.trigger("chat", "new-message", req.body);

  res.json({ success: true, message: "Сообщение отправлено!" });
});

app.get("/ping", (req, res) => {
  const incomingSessionId = req.headers["x-session-id"];
  // Отправляем событие в Pusher
  if (!incomingSessionId === activeSessionId)
    return res.status(401).json({ message: "no auth" });
  pusher.trigger("chat", "ping", { timestamp: Date.now() });

  res.json({ success: true, message: "pong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
