// export function getReactFiber(element: HTMLElement): any {
//   return Object.entries(element).find(([key]) =>
//     key.startsWith("__reactFiber$")
//   )?.[1];
// }

// подписывается на конкретную страницу
export const sendMessageToRuntime = async (
  request: object,
  callback: (response: any) => void
) => {
  const url = await getActiveTabUrl();
  if (!url) return;

  chrome.runtime.sendMessage(
    { ...request, url }, // Добавляем текущий URL в запрос
    (response) => {
      if (callback) {
        callback(response);
      }
    }
  );
};

const getActiveTabUrl = (): Promise<string | null> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        resolve(tabs[0].url || null);
      } else {
        resolve(null);
      }
    });
  });
};

const messageHandlers: Record<
  string,
  (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void
> = {};

export const registerMessageHandler = (
  action: string,
  handler: (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void
) => {
  messageHandlers[action] = handler;
};

// Устанавливаем единый слушатель для всех обработчиков
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action && messageHandlers[message.action]) {
    messageHandlers[message.action](message, sender, sendResponse);
    return true; // Позволяет асинхронно отправлять данные
  } else {
    sendResponse({ status: "error", message: "Unknown action" });
  }
});
