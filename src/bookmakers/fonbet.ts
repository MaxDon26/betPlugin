function setSum(sum: number) {
  if ((window as any).CouponsCart) {
    (window as any).CouponsCart.sum = sum * 100;
  }
}

function fonbetRequest(element: any, meta: any) {
  const isOneClick = (window as any).CouponsCart._oneClickBet;
  const now = new Date().getTime();
  if (isOneClick) {
    trySetInputValue('input[name="one-click-sum"]', meta.sumBet, () => {
      setTimeout(() => {
        const elementHTML = findElementByProps(
          element?.meta,
          "[class*='factor']",
          "__reactFiber$",
          ["return", "pendingProps", "cell", "factorId"],
          null,
          "[class*='cell']"
        );

        if (!elementHTML) return;
        const time = new Date().getTime() - now;

        console.log(time);
        // document.body.focus();
        // document.body.click();

        elementHTML.focus();
        elementHTML?.click();
      }, 40);
    });
  } else {
    const elementHTML = findElementByProps(
      element?.meta,
      "[class*='factor']",
      "__reactFiber$",
      ["return", "pendingProps", "cell", "factorId"],
      null,
      "[class*='cell']"
    );

    if (!elementHTML) return;
    elementHTML?.click();
    trySetInputValue('input[name="coupon-sum"]', meta.sumBet, () => {
      const submitBtn = document.querySelector(
        '[class*="button-place"]'
      ) as HTMLButtonElement;
      if (submitBtn && !submitBtn.className.includes("disabled")) {
        const time = new Date().getTime() - now;

        console.log(time);
        submitBtn.click();
      }
    });
  }
}

console.log("object");
const waitForElement = (selector: string, timeout = 5000, interval = 200) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkElement = () => {
      const element = document.querySelector(selector);

      if (element) {
        resolve(element);
        console.log(element);
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error(`Элемент не найден за ${timeout / 1000} секунд`));
      } else {
        setTimeout(checkElement, interval);
      }
    };

    checkElement();
  });
};

waitForElement('[data-component-part="toggle"]')
  .then((element) => {
    (element as HTMLDivElement).click();

    console.log("click");

    // waitForElement("#betPlacingModeRadio_Any")
    //   .then((element) => {
    //     (element as HTMLInputElement).click();
    //   })
    //   .catch((error) => console.error(error.message));
  })
  .catch((error) => console.error(error.message));
