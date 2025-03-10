export const createElement = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  options?: Partial<HTMLElementTagNameMap[T]>
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tag) as HTMLElementTagNameMap[T];
  if (options) {
    Object.assign(element, options);
  }
  return element;
};

// Пример использования

export const createButton = (
  text: string,
  options?: Partial<HTMLButtonElement>
) => {
  const button = createElement("button", options);
  button.innerText = text;
  return button;
};
