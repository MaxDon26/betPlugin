import { useEffect, useState } from "react";
import axios from "axios";

export const useSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const newSessionId = crypto.randomUUID(); // Уникальный идентификатор сессии
    setSessionId(newSessionId);

    axios
      .post("http://localhost:5002/api/register-session", {
        sessionId: newSessionId,
      })
      .catch((err) => console.error("Ошибка при регистрации сессии:", err));

    return () => {
      axios
        .post("http://localhost:5002/api/unregister-session", {
          sessionId: newSessionId,
        })
        .catch((err) => console.error("Ошибка при удалении сессии:", err));
    };
  }, []);

  return sessionId;
};
