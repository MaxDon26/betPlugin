import { useState, useEffect } from "react";
import "./popup.css";
import { registerMessageHandler, sendMessageToRuntime } from "../utils/utils";

//1 жмем кнопку для активации селектора
// 1.1 пробрасываем команду в контент скрипт
// 2 активируется выбор селектора
// 2.1 сохраняем селектор в бэкграунд скрипт для фиксации в плагине
// 3 удаление селектора
// 4 сброс селекторов

// default selectors
const selectorsData = {
  WIN__P1: null,
  WIN__P2: null,
  WIN__PX: null,
};

function Popup() {
  const [selectors, setSelectors] =
    useState<Partial<Record<keyof typeof selectorsData, boolean | null>>>(
      selectorsData
    );

  useEffect(() => {
    // надо запросить селекторы из background при открытии попапа
    // sendMessageToRuntime({ action: "getSelectors" }, (response) => {
    //   if (response) {
    //     setSelectors((prev) => ({
    //       ...prev,
    //       ...response,
    //     }));
    //   }
    // });
    // registerMessageHandler("saveSelector", (message) => {
    //   setSelectors((prev) => ({
    //     ...prev,
    //     [message.selector]: true,
    //   }));
    // });
  }, []);

  const clearSelectors = () => {
    // sendMessageToRuntime(
    //   { action: "clearSelectors", selectors: selectorsData },
    //   () => {}
    // );
    setSelectors(selectorsData);
  };

  //1.1
  const activateSelector = (selector: keyof typeof selectors) => {
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   if (tabs[0]?.id) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //       action: "activateSelector",
    //       selector,
    //     });
    //   }
    // });
    window.postMessage({ action: "activateSelector", selector }, "*");
  };

  const removeSelector = (
    e: React.MouseEvent<HTMLElement>,
    selector: keyof typeof selectors
  ) => {
    const updateSelectors = { ...selectors };
    updateSelectors[selector] = null;
    e.stopPropagation();
    setSelectors(updateSelectors);

    // sendMessageToRuntime({ action: "removeSelector", selector }, () => {});
  };

  const triggerClick = (selector: keyof typeof selectorsData) => {
    console.log(selector);
    if (!selectors[selector]) return activateSelector(selector);

    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   if (tabs[0]?.id) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //       action: "requestData",
    //       selector,
    //     });
    //   }
    // });
  };

  return (
    <div className="container">
      {/* <button onClick={activateSelector}>Добавить элемент</button> */}
      <h3>Сохранённые элементы:</h3>
      <div className="saved-elements">
        {Object.keys(selectors).map((el, index) => (
          <div className="saved-element">
            <button
              key={index}
              className={
                selectors[el as keyof typeof selectors] ? "active" : ""
              }
              onClick={() => triggerClick(el as keyof typeof selectors)}
            >
              {el}
            </button>
            {selectors[el as keyof typeof selectors] && (
              <span
                className="remove"
                onClick={(e) => removeSelector(e, el as keyof typeof selectors)}
              >
                X
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="clear" onClick={clearSelectors}>
        Очистить
      </div>
    </div>
  );
}

export default Popup;
