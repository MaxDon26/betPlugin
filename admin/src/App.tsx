import React from "react";
import "./App.css"; // Подключаем стили

const Admin: React.FC = () => {
  // Функция отправки команды
  const sendCommand = async (command: string) => {
    try {
      await fetch("http://localhost:5000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: command, send: Date.now() }),
      });
    } catch (error) {
      console.error("❌ Ошибка отправки команды:", error);
    }
  };

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
