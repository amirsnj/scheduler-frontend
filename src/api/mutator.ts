import type { AxiosRequestConfig } from "axios";
import apiClient from "./axios";

// این تابع توسط تمام سرویس‌های تولید شده فراخوانی می‌شود
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return apiClient({
    ...config,
    ...options,
  }).then(({ data }) => data);
};
