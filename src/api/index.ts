import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token");

    if (token && config.headers) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
