import Cookies from "js-cookie";
import { DEFAULT_COOKIE_OPTIONS } from "@data/constants/cookie.config";

export const cookie = {
  // Set cookie dynamically with default options
  set(key: string, value: Record<string, unknown> | string, options = DEFAULT_COOKIE_OPTIONS) {
    const data = typeof value === "object" ? JSON.stringify(value) : value;
    Cookies.set(key, data, { ...DEFAULT_COOKIE_OPTIONS, ...options });
  },

  // Get cookie dynamically
  get<T = Record<string, unknown> | string>(key: string): T | null {
    const data = Cookies.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return data as T;
    }
  },

  // Delete a specific cookie
  remove(key: string, options = DEFAULT_COOKIE_OPTIONS) {
    Cookies.remove(key, { ...DEFAULT_COOKIE_OPTIONS, ...options });
  },

  // Clear all cookies
  clearAll() {
    const all = Cookies.get();
    Object.keys(all).forEach((key) =>
      Cookies.remove(key, DEFAULT_COOKIE_OPTIONS)
    );
  },
};
