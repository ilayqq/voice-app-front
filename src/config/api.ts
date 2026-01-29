const DEFAULT_API_BASE_URL = 'http://sam.x64.kz:8080'

export const API_CONFIG = {
  get baseURL(): string {
    return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL
  },
  
  getBaseURL(): string {
    return this.baseURL
  }
}

export default API_CONFIG

