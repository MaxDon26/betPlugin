function getNestedReactFiberProperty(
  target: HTMLElement | null | Object,
  keyPrefix: string,
  propertyPath: string[]
): any {
  let element = target as HTMLElement;
  if (!element) return null;

  const fiberKey = Object.keys(element).find((key) =>
    key.startsWith(keyPrefix)
  );
  if (!fiberKey) return null;

  let value: any = (element as any)[fiberKey];
  for (const key of propertyPath) {
    if (value == null) return null;
    value = value[key];
  }

  return value;
}

function findElementByProps(
  meta: Record<string, string>,
  selector: string,
  keyPrefix: string,
  propertyPath: Record<string, string[]>
  // elementProperty: keyof HTMLElement | null = null,
  // targetElement?: string
): HTMLElement | null {
  return (
    Array.from(
      document.querySelectorAll(selector) as NodeListOf<HTMLElement>
    ).find((item) => {
      return Object.entries(meta).every(([key, val]) => {
        const value = getNestedReactFiberProperty(
          item,
          keyPrefix,
          propertyPath[key]
        );

        return value === val;
      });
    }) || null
  );
}

function simulateClick(x: number, y: number) {
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: x,
    clientY: y,
  });

  const element = document.elementFromPoint(x, y);
  if (element) {
    element.dispatchEvent(clickEvent);
  } else {
    console.warn(`❌ Нет элементов в координатах (${x}, ${y})`);
  }
}
// задезеблйить п2 при только п1
const trySetInputValue = (
  selector: string,

  amount: string,
  cb?: () => void,
  delay = 5
) => {
  const input = document.querySelector(selector) as HTMLInputElement;

  if (input) {
    // Проверяем, установлено ли уже значение
    input.focus();
    document.execCommand("selectAll", false, "");
    document.execCommand("insertText", false, amount);

    // input.dispatchEvent(new Event("change"));
    input.dispatchEvent(new Event("focusout", { bubbles: true }));
    input.blur();

    if (input.value === amount && cb) {
      cb();
    }
  } else {
    console.log(`❌ Поле ввода не найдено, пробуем снова через ${delay} мс`);
    if (delay > 5000) return;
    setTimeout(() => trySetInputValue(selector, amount, cb, delay), delay);
  }
};

// увеличить шрифт суммы
// поменять название на сумма ставки
// сделать простановку суммы по кнопке
// проверять перед
// Проверка баланса в админку
// показать привязанные ставки в админку
// zenith проверять, развернуты ли рынки
// под суммой ставки мини - кнопки с суммами - 5000-10000-15000
