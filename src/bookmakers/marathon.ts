function marathonRequest(element: any, meta: any) {
  const isOneClick = (
    document.querySelector('input[name="checked"]') as HTMLInputElement
  )?.checked;
  const lastDashIndex = element?.meta.factorId.lastIndexOf("-");
  const id =
    lastDashIndex !== -1
      ? element?.meta.factorId.slice(0, lastDashIndex)
      : element?.meta.factorId;
  const now = new Date().getTime();
  if (isOneClick) {
    trySetInputValue("#b1c-stake", meta.sumBet, () => {
      setTimeout(() => {
        const saveSum = document.querySelector(
          ".betslip-b1c__confirm"
        ) as HTMLButtonElement;

        if (saveSum) saveSum.click();
        const elementHTML = document.querySelector(
          `[data-coeff-uuid*="${id}"]`
        ) as HTMLElement;
        if (!elementHTML) return;
        const time = new Date().getTime() - now;

        elementHTML.focus();
        elementHTML?.click();
      }, 0);
    });
  } else {
    const elementHTML = document.querySelector(
      `[data-coeff-uuid*="${id}"]`
    ) as HTMLElement;
    if (!elementHTML) return;

    elementHTML?.click();
    trySetInputValue(".input-content input", meta.sumBet, () => {
      const submitBtn = document.querySelector(
        ".betslip-controls__placebet"
      ) as HTMLButtonElement;

      if (submitBtn) submitBtn.click();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const waitForElement = (selector: string, timeout = 5000, interval = 200) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const checkElement = () => {
        const element = document.querySelector(selector);

        if (element) {
          resolve(element);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error(`Элемент не найден за ${timeout / 1000} секунд`));
        } else {
          setTimeout(checkElement, interval);
        }
      };

      checkElement();
    });
  };

  waitForElement("#bet-in-one-click-checked")
    .then((element) => {
      (element as HTMLInputElement).click();

      waitForElement("#betPlacingModeRadio_Any")
        .then((element) => {
          (element as HTMLInputElement).click();
        })
        .catch((error) => console.error(error.message));
    })
    .catch((error) => console.error(error.message));
});
