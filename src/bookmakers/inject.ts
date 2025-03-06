const selectors: Record<string, { el: HTMLElement; meta: any } | null> = {
  WIN__P1: null,
  WIN__P2: null,
  WIN__PX: null,
};

let isSelectorMode = false;
let activeSelector: keyof typeof selectors | null = null;

// слуцшаем сообщения от контент скрипта об активации селектора
window.addEventListener("message", (event) => {
  if (!event.data?.action) return;

  if (event.data.action === "activateSelector") {
    // активируем режим селектора
    isSelectorMode = true;
    // сохраняем активный селектор (WIN__P1, WIN__P2, WIN__PX)
    activeSelector = event.data.selector;
  }
  // тут триггер селектора
  // доработать под марафон
  else if (event.data.action === "requestData") {
    const element = selectors[event.data.data];

    switch (window.location.host) {
      // для марафона нужно выбрать td обязательно и мету
      case "www.marathonbet.ru": {
        const selector = getSelectorByMeta(element?.meta);

        if (selector) (selector as HTMLElement).click();
        break;
      }
      case "fon.bet":
      case "pari.ru": {
        const selector = findElementByProps({ marketId: element?.meta });

        if (selector) (selector as HTMLElement).click();
        break;
      }
      default: {
        (element?.el as HTMLElement)?.click();
      }
    }
  }
});

document.addEventListener(
  "click",
  (event) => {
    try {
      // получаем target клика
      const target = event.target as HTMLElement;

      if (!target || !activeSelector || !isSelectorMode) return;
      console.log(target);
      event.preventDefault();
      event.stopImmediatePropagation();

      // записываем в хранилище ссылку на селектор
      selectors[activeSelector] = { el: target, meta: null };

      // отключаем режим селектора
      isSelectorMode = false;

      switch (window.location.host) {
        // для марафона нужно выбрать td обязательно и мету
        case "www.marathonbet.ru": {
          const selector = maraphonSelector(target);
          if (selector) {
            if (!selector.dataset.coeffUuid) return;
            selectors[activeSelector] = {
              el: selector,
              meta: selector.dataset,
            };
          }

          break;
        }

        case "fon.bet":
        case "pari.ru": {
          const el = target.closest("[class*='cell']");

          if (!el) return;
          const selector = getReactFiberMeta(el);
          selectors[activeSelector] = {
            el: el as HTMLElement,
            meta: selector,
          };
          console.log(selector);
          break;
        }
      }

      // отправляем сообщение в контент скрипт об активации селектора
      console.log(activeSelector);
      window.postMessage({ action: "saveSelector", data: activeSelector }, "*");
    } catch (error) {
      console.log(error);
      window.postMessage({ action: "saveSelector", data: null }, "*");
    }
  },
  true
);
