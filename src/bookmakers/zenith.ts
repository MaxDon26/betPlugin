function zenithRequest(element: any, meta: any) {
  const el = findElementByProps(element.meta, "td", "__reactInternalInstance", [
    "return",
    "pendingProps",
    "cfID",
  ]);

  if (!el) return;
  el.querySelector("a")!.click();
  trySetInputValue(".basket-item-sum input", meta.sumBet, () =>
    (
      document.querySelector(".basket-make-bet-button") as HTMLButtonElement
    )?.click()
  );
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

  waitForElement(".basket-agree-cf__select")
    .then((element) => {
      (element as HTMLSelectElement).value = "1";
    })
    .catch((error) => console.error(error.message));
});
