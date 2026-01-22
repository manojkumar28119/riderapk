export const storage = {
  // Set item in localStorage
  set(key: string, value: Record<string, unknown> | string) {
    try {
      const data = typeof value === "object" ? JSON.stringify(value) : value;
      window.localStorage.setItem(key, data);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  // Get item from localStorage
  get<T = any>(key: string): T | null {
    try {
      const data = window.localStorage.getItem(key);
      if (!data) return null;

      try {
        return JSON.parse(data);
      } catch {
        return data as T;
      }
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  },

  // Remove a specific item from localStorage
  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  // Clear all items from localStorage
  clearAll() {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};