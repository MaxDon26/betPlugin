import { Bookmakers, getBookmakerName } from "./bookmakers/bookmakersEnum";
import { registerMessageHandler } from "./utils/utils";

const selectors: Record<keyof typeof Bookmakers, any> = {
  FONBET: null,
  PARI: null,
  WINLINE: null,
  BETBOOM: null,
  MARATHON: null,
  ZENIT: null,
};

registerMessageHandler("clearSelectors", (message) => {
  const bkName = getBookmakerName(message.url);
  if (!bkName || !message.selectors) return;
  selectors[bkName as keyof typeof selectors] = message.selectors;

  console.log(selectors);
  console.log(`📌 Селектор сброшен для бк ${bkName}:`, selectors);
});

registerMessageHandler("saveSelector", (message) => {
  const bkName = getBookmakerName(message.url);
  if (!bkName || !message.selector) return;
  selectors[bkName as keyof typeof selectors] = {
    ...selectors[bkName as keyof typeof selectors],
    [message.selector]: true,
  };

  console.log(selectors);
  console.log(`📌 Селектор сохранён для бк ${bkName}:`, selectors);
});

registerMessageHandler("removeSelector", (message) => {
  const bkName = getBookmakerName(message.url);
  if (!bkName || !message.selector) return;
  selectors[bkName as keyof typeof selectors] = {
    ...selectors[bkName as keyof typeof selectors],
    [message.selector]: null,
  };

  console.log(selectors);
  console.log(`📌 Селектор сохранён для бк ${bkName}:`, selectors);
});

registerMessageHandler("getSelectors", (message, sender, sendResponse) => {
  const bkName = getBookmakerName(message.url);
  if (!bkName) return;

  sendResponse(selectors[bkName as keyof typeof selectors]);
  console.log(
    `📌 Селектор отдан для бк ${bkName}:`,
    selectors[bkName as keyof typeof selectors]
  );
  return true;
});
