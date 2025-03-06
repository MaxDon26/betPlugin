export enum Bookmakers {
  FONBET = "https://fon.bet/",
  PARI = "https://pari.ru/",
  WINLINE = "https://winline.ru/",
  BETBOOM = "https://betboom.ru/",
  MARATHON = "https://www.marathonbet.ru/",
  ZENIT = "https://zenit.win/",
}

export const getBookmakerName = (url: string): string | null => {
  const bookmakerEntry = Object.entries(Bookmakers).find(
    ([_, baseUrl]) => url.startsWith(baseUrl) // Проверяем, начинается ли переданный URL с baseUrl
  );

  return bookmakerEntry ? bookmakerEntry[0] : null; // Возвращаем ключ (название)
};
