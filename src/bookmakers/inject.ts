const selectors: Record<string, { el: HTMLElement; meta: any } | null> = {
  GOAL__P1: null,
  GOAL__P2: null,
};

let isSelectorMode = false;
let activeSelector: keyof typeof selectors | null = null;
let interval: number | null = null;
let isOneClick = false;

// Функция для очистки интервала
const clearSelectorInterval = () => {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }
};

// Функция проверки доступности селекторов
const checkSelectors = () => {
  const activeEntries = Object.entries(selectors).filter(
    ([_, value]) => value !== null
  );

  // Если селекторов нет — останавливаем интервал
  if (activeEntries.length === 0) {
    clearSelectorInterval();
    return;
  }

  activeEntries.forEach(([selectorKey, elementData]) => {
    if (!elementData) return;

    let isSuccess = false;

    switch (window.location.host) {
      case "www.marathonbet.ru": {
        const lastDashIndex = elementData?.meta.factorId.lastIndexOf("-");
        const id =
          lastDashIndex !== -1
            ? elementData?.meta.factorId.slice(0, lastDashIndex)
            : elementData?.meta.factorId;
        const el = document.querySelector(
          `[data-coeff-uuid*="${id}"]`
        ) as HTMLElement;

        if (!el?.classList.contains("selectedBet")) {
          el?.classList.add("selectedBet");
          const keyEl = document.createElement("div");

          keyEl.id = "key";
          keyEl.textContent = selectorKey;
          el?.appendChild(keyEl);
        }

        isSuccess = !!el;

        break;
      }
      case "fon.bet":
      case "pari.ru": {
        const element = findElementByProps(
          elementData?.meta,
          "[class*='factor']",
          "__reactFiber$",
          {
            factorId: ["return", "return", "pendingProps", "cell", "factorId"],
            eventKind: [
              "return",
              "return",
              "pendingProps",
              "cell",
              "eventKind",
            ],
          }
        );

        if (!element?.classList.contains("selectedBet")) {
          element?.classList.add("selectedBet");
          const keyEl = document.createElement("div");

          keyEl.id = "key";
          keyEl.textContent = selectorKey;
          element?.appendChild(keyEl);
        }

        isSuccess = !!element;
        break;
      }
      case "zenit.win": {
        const el = findElementByProps(
          elementData.meta,
          "td",
          "__reactInternalInstance",
          { factorId: ["return", "pendingProps", "cfID"] }
        );

        if (!el?.classList.contains("selectedBet")) {
          el?.classList.add("selectedBet");
          const keyEl = document.createElement("div");

          keyEl.id = "key";
          keyEl.textContent = selectorKey;
          if (!el?.querySelector("#key")) el?.appendChild(keyEl);
        }

        isSuccess = !!el;
      }
      default: {
      }
    }

    window.postMessage(
      {
        action: "accessSelector",
        data: { selector: selectorKey, success: isSuccess },
      },
      "*"
    );
  });
};

// Запускаем интервальную проверку (если её ещё нет)
const startCheckingInterval = () => {
  if (interval === null) {
    interval = setInterval(checkSelectors, 100);
  }
};

// Слушаем сообщения от content script
window.addEventListener("message", (event) => {
  if (!event.data?.action) return;

  if (event.data.action === "activateSelector") {
    isSelectorMode = true;
    activeSelector = event.data.selector;
  } else if (event.data.action === "requestData") {
    const onlyP1 = (document.querySelector("#ONLY_P1") as HTMLInputElement)
      .checked;
    const element = selectors[onlyP1 ? "GOAL__P1" : event.data.data];

    if (!element || !element.el || !element.meta) return;

    const meta: { sumBet: string } = event.data.meta || {};

    switch (window.location.host) {
      case "www.marathonbet.ru": {
        marathonRequest(element, meta);
        break;
      }
      case "fon.bet":
      case "pari.ru": {
        fonbetRequest(element, meta);
        break;
      }
      case "zenit.win": {
        zenithRequest(element, meta);
        break;
      }
    }
  } else if (event.data.action === "clearSelectors") {
    for (const key in selectors) {
      selectors[key]?.el?.classList.remove("selectedBet");
      selectors[key]?.el?.querySelector("#key")?.remove();
      selectors[key] = null;
    }
  } else if (event.data.action === "setSum") {
    switch (window.location.host) {
      case "www.marathonbet.ru": {
        const isOneClick = (
          document.querySelector('input[name="checked"]') as HTMLInputElement
        )?.checked;
        if (!isOneClick) return;
        trySetInputValue('input[name="one-click-sum"]', event.data.data);
        break;
      }
      case "fon.bet":
      case "pari.ru": {
        const isOneClick = (window as any).CouponsCart._oneClickBet;
        if (!isOneClick) return;
        trySetInputValue(`input[name="one-click-sum"]`, event.data.data);
        break;
      }
    }
  }
});

// Фиксируем элемент при клике
document.addEventListener(
  "click",
  (event) => {
    try {
      const target = event.target as HTMLElement;

      if (!target || !activeSelector || !isSelectorMode) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      selectors[activeSelector] = { el: target, meta: null };
      isSelectorMode = false;

      switch (window.location.host) {
        case "www.marathonbet.ru": {
          const el = target.closest("td");
          if (el) {
            selectors[activeSelector] = {
              el: el as HTMLElement,
              meta: {
                factorId: getNestedReactFiberProperty(
                  el.dataset,
                  "coeffUuid",
                  []
                ),
              },
            };
          }
          break;
        }

        case "fon.bet":
        case "pari.ru": {
          const el = target.closest("[class*='factor']");

          const meta = {
            factorId: getNestedReactFiberProperty(el, "__reactFiber$", [
              "return",
              "return",
              "pendingProps",
              "cell",
              "factorId",
            ]),
            eventKind: getNestedReactFiberProperty(el, "__reactFiber$", [
              "return",
              "return",
              "pendingProps",
              "cell",
              "eventKind",
            ]),
          };
          if (el) {
            selectors[activeSelector] = {
              el: el as HTMLElement,
              meta: meta,
            };
          }
          break;
        }
        case "zenit.win": {
          const el = target.closest("td");
          const meta = {
            factorId: getNestedReactFiberProperty(
              el,
              "__reactInternalInstance",
              ["return", "pendingProps", "cfID"]
            ),
          };
          if (!el) return;
          selectors[activeSelector] = {
            el: el,
            meta,
          };

          break;
        }
      }
      console.log(selectors);
      // Сообщаем content script об активации селектора
      window.postMessage(
        {
          action: "saveSelector",
          data: activeSelector,
          text: target.textContent,
        },
        "*"
      );

      // Запускаем интервальную проверку (если ещё не запущена)
      startCheckingInterval();
    } catch (error) {
      console.error(error);
      window.postMessage({ action: "saveSelector", data: null }, "*");
    }
  },
  true
);
