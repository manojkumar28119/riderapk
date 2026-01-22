import axios from "axios";
import type { AxiosInstance } from "axios";
import { auth } from "@lib/utils/auth";


const httpClient = (baseURL?: string): AxiosInstance => {
  const api = axios.create({
    baseURL: baseURL || import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor → attach token if present
  api.interceptors.request.use(
    (config) => {
      const token = auth.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );


  return api;
};

export default httpClient;
const apiClient = httpClient();
export { apiClient };