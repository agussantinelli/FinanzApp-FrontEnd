import axios from "axios";
import { BASEURL } from "@/config/api";

export const http = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("fa_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        console.error('Sesión inválida o servidor reiniciado. Redirigiendo...');
        localStorage.removeItem("fa_token");
        localStorage.removeItem("fa_user");

        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login?expired=true";
        }
      }
    }
    return Promise.reject(error);
  }
);
