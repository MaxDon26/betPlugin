export {}; // Делаем файл модулем (исключает ошибку с declare global)

declare global {
  // Типы сообщений от background к content_script
  interface MessageToContent {
    action: "sendData";
    data: string;
  }

  // Типы сообщений от content_script к injected_script
  interface MessageToInjected {
    source: "content-script";
    data: string;
  }

  // Типы сообщений от content_script к background
  type MessageToBackground =
    | { action: "saveSelector"; selector: string }
    | { action: "requestData" };

  // Тип ответа на сообщения
  interface MessageResponse {
    status: "success" | "error";
    message?: string;
  }

  // Делаем объект доступным в глобальной области
  interface Window {
    isSelectorMode?: boolean;
  }
}
