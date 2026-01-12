// Конфигурация API
// Backend endpoint можно настроить через переменную окружения VITE_API_BASE_URL
// или изменить значение по умолчанию ниже в коде

const DEFAULT_API_BASE_URL = 'http://localhost:8080/'

export const API_CONFIG = {
  // Базовый URL API
  // Приоритет: 1) переменная окружения VITE_API_BASE_URL, 2) значение по умолчанию
  get baseURL(): string {
    return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
  },
  
  // Получить текущий base URL
  getBaseURL(): string {
    return this.baseURL
  }
}

export default API_CONFIG

