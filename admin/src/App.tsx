import React, { useEffect } from "react";
import "./App.css"; // Подключаем стили
import { useApiRequest } from "./hooks/useApiRequest";
import { useSession } from "./hooks/useSession";

const Admin: React.FC = () => {
  // Функция отправки команды
  const sessionId = useSession();
  const { sendRequest } = useApiRequest(sessionId);
  const sendCommand = async (command: string) => {
    try {
      await sendRequest({
        method: "POST",
        url: "http://localhost:5002/send-message",
        data: JSON.stringify({ message: command, send: Date.now() }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("❌ Ошибка отправки команды:", error);
    }
  };

  useEffect(() => {
    const clear = setInterval(() => {
      sendRequest({ url: "http://localhost:5002/ping" });
    }, 3000);

    return () => clearInterval(clear);
  }, [sessionId]);

  return (
    <div className="admin-container">
      <h2 className="admin-title">🔥 Админ панель</h2>
      <div className="button-group">
        <button
          className="admin-button"
          onClick={() => sendCommand("GOAL__P1")}
        >
          ГОЛ П1
        </button>
        <button
          className="admin-button"
          onClick={() => sendCommand("GOAL__P2")}
        >
          ГОЛ П2
        </button>
      </div>
    </div>
  );
};

export default Admin;
