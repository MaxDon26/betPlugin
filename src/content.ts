import { createButton, createElement } from "./pages/popupFile";
import { addCursorCircle, removeCursorCircle } from "./components/circle";
import { channelAction } from "./api";
// сделать маленькие кнопки сумм и больше
// очищать селектор
// сделать привязку к машине для пинга
import "./content.css";

// // Ловим сообщения от ejcet и пересылаем их в background.js
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (!event.data || typeof event.data !== "object") return; // Добавил проверку

  if (event.data.action === "saveSelector") {
    removeCursorCircle();

    if (!event.data.data) return;
    (
      document.querySelector(`#${event.data.data}`) as HTMLButtonElement
    ).classList.add("active");
  }

  if (event.data.action === "accessSelector") {
    (
      document.querySelector(
        `#${event.data.data.selector}`
      ) as HTMLButtonElement
    ).disabled = !event.data.data.success;
  }
});

init();

let sumInput: null | HTMLInputElement = null;
let indicator: null | HTMLDivElement = null;
channelAction((message) => {
  window.postMessage(
    {
      action: "requestData",
      data: message,
      meta: {
        sumBet: sumInput?.value,
      },
    },
    "*"
  );
}, "new-message");
let inactiveTimeout: any | null = null;
// пингуем сокет
channelAction((message) => {
  indicator?.classList.add("active");
  indicator?.classList.remove("inactive");

  // Убедимся, что предыдущий таймер на 10 секунд очищен
  if (inactiveTimeout) clearTimeout(inactiveTimeout);

  inactiveTimeout = setTimeout(() => {
    indicator?.classList.add("inactive");
  }, 10000);

  setTimeout(() => {
    indicator?.classList.remove("active");
  }, 1000);
}, "ping");
const trigger = (selector: "GOAL__P1" | "GOAL__P2" | "SUBMIT") => {
  addCursorCircle();

  window.postMessage({ action: "activateSelector", selector }, "*");
};

function generatePopup() {
  document.addEventListener("DOMContentLoaded", () => {
    indicator = createElement("div", { className: "indicator" });
    const pupup = document.createElement("div");
    pupup.appendChild(indicator);
    pupup.id = "popup";
    pupup.className = "pupup-container";
    document.body.appendChild(pupup);

    const containerButton = createElement("div", {
      className: "container-btn",
    });
    const goal1 = createButton("ГОЛ П1", {
      id: "GOAL__P1",
      onclick: () => trigger("GOAL__P1"),
    });
    const goal2 = createButton("ГОЛ П2", {
      id: "GOAL__P2",
      onclick: () => trigger("GOAL__P2"),
    });

    const labelOnlyP1 = createElement("label", {
      htmlFor: "ONLY_P1",
      textContent: "Только П1",
    });
    const onlyP1 = createElement("input", {
      type: "checkbox",
      id: "ONLY_P1",
      className: "only-p1",
      onchange: () => {
        goal2.classList.toggle("inactive");
      },
    });

    const clearBtn = createButton("X", {
      onclick: () => {
        window.postMessage({ action: "clearSelectors" }, "*");
        [goal1, goal2].forEach((el) => {
          el.disabled = false;
          el.classList.remove("active");
        });
        onlyP1.checked && onlyP1.click();
      },
      className: "clear",
    });

    labelOnlyP1.append(onlyP1);

    containerButton.append(labelOnlyP1);

    sumInput = createElement("input", {
      type: "number",
      id: "SUM",
      placeholder: "Сумма",
      className: "input-sum",

      onkeydown: (e) => {
        if (e.key === "Enter") {
          // console.log((e.target as HTMLInputElement)!.value);
          window.postMessage(
            { action: "setSum", data: (e.target as HTMLInputElement)!.value },
            "*"
          );
        }
      },
    });

    const labelSum = createElement("label", {
      htmlFor: "SUM",
      textContent: "Сумма ставки",
      className: "label-sum",
    });

    const submit = createButton("Подтвердить", {
      id: "confirmSum",
      onclick: () =>
        window.postMessage({ action: "setSum", data: sumInput?.value }, "*"),
    });

    const btnsOneClickContainer = createElement("div", {
      className: "btns-one-click-container",
    });

    btnsOneClickContainer.append(
      ...[1000, 2000, 3000, 5000, 7000, 10000, 12000, 15000].map((sum) =>
        createButton(`${sum} руб`, {
          onclick: () => {
            window.postMessage({ action: "setSum", data: sum }, "*");
          },
          className: "btn-one-click",
        })
      )
    );

    labelSum.append(sumInput, submit);

    pupup.append(containerButton, labelSum, btnsOneClickContainer);
    containerButton.append(goal1, goal2, clearBtn);
  });
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
  injectScript("bookmakers/zenith.js");
  injectScript("bookmakers/bookmaker.js");
  injectScript("bookmakers/inject.js");
}

generatePopup();
