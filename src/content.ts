// import { url } from "inspector";
import "./content.css";
import Pusher from "pusher-js";
import "./pages/popupFile";

const pusher = new Pusher("a8b7b2f88f82155450ac", {
  cluster: "eu",
});

const channel = pusher.subscribe("chat");
channel.bind(
  "new-message",
  (data: { message: string; send: number; receive: number }) => {
    data.receive = Date.now();
    console.log(data, data.receive - data.send);

    window.postMessage({ action: "requestData", data: data.message }, "*");
  }
);

// Ловим сообщения от ejcet и пересылаем их в background.js
window.addEventListener("message", (event) => {
  // console.log(event.data);
  if (event.source !== window) return;

  if (!event.data || typeof event.data !== "object") return; // Добавил проверку

  if (event.data.action === "saveSelector") {
    removeCursorCircle();
    console.log(event.data);
    if (!event.data.data) return;

    //отправляем сообщение в background для сохранения и в popup
    chrome.runtime.sendMessage({
      action: "saveSelector",
      selector: event.data.data,
      url: window.location.href,
    });
  } else if (event.data.action === "activateSelector") {
    console.log(event.data);
  }
});

//слушаем сообщения от popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activateSelector") {
    addCursorCircle();

    //отправляем сообщение об активации режима в pupup
    sendResponse({
      status: "🔍 Режим селектора включен. Кликните на элемент.",
    });

    // прокидываем в inject скрипт сообщение для активации режима клика
    window.postMessage(
      { action: "activateSelector", selector: message.selector },
      "*"
    );
  } else if (message.action === "requestData") {
    console.log(message);
    window.postMessage({ action: "requestData", data: message.selector }, "*");
  }
});

let cursorCircle: HTMLDivElement | null = null;
function addCursorCircle() {
  if (cursorCircle) return; // Если кружок уже есть, не создаём новый

  cursorCircle = document.createElement("div");
  cursorCircle.id = "custom-cursor-circle";
  document.body.appendChild(cursorCircle);

  document.addEventListener("mousemove", moveCursorCircle);
}

function moveCursorCircle(event: MouseEvent) {
  if (!cursorCircle) return;
  cursorCircle.style.left = `${event.clientX}px`;
  cursorCircle.style.top = `${event.clientY}px`;
}

function removeCursorCircle() {
  if (cursorCircle) {
    cursorCircle.remove();
    cursorCircle = null;
  }
  document.removeEventListener("mousemove", moveCursorCircle);
}

function init() {
  function injectScript(file: string) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL(file);
    // script.type = "module";
    script.onload = function () {
      (this as HTMLScriptElement).remove(); // Удаляем тег `<script>` после загрузки
    };
    script.onerror = function () {
      console.error(`Ошибка загрузки скрипта: ${file}`);
    };

    (document.head || document.documentElement).appendChild(script);
  }

  // Загружаем `injected.js` в контекст страницы
  injectScript("bookmakers/marathon.js");
  injectScript("bookmakers/fonbet.js");
  injectScript("bookmakers/inject.js");
}

init();

document.addEventListener("DOMContentLoaded", () => {
  const pupup = document.createElement("div");
  pupup.id = "popup";
  pupup.className = "pupup-container";
  document.body.appendChild(pupup);

  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/popup.js"); // Загружаем React код

  document.body.appendChild(script);
});
