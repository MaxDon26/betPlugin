import axios, { AxiosRequestConfig, Method } from "axios";

interface ApiRequestOptions {
  method?: Method;
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

export const useApiRequest = (sessionId: string | null) => {
  const sendRequest = async ({
    method = "GET",
    url,
    data,
    headers,
  }: ApiRequestOptions): Promise<any> => {
    if (!sessionId) return; // Если токена нет — не отправляем запрос

    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        data,
        headers: {
          ...headers,
          "X-Session-Id": sessionId,
        },
      };

      const response = await axios(config);
      console.log("Ответ:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка запроса:", error);
      throw error;
    }
  };

  return { sendRequest };
};
