import API_CONFIG from '../config/api'
import type { Product, InventoryItem, Operation } from '../types'

// Типы для авторизации
export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface RegisterRequest {
  phoneNumber: string
  password: string
  name?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    phoneNumber: string
    name?: string
  }
}

// API клиент
class ApiClient {
  private get baseURL(): string {
    return API_CONFIG.getBaseURL()
  }

  // Получить заголовки с токеном
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (includeAuth) {
      const token = localStorage.getItem('auth_token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    return headers
  }

  // Обработка ответа
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Ошибка сервера' }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  // Авторизация
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    })
    return this.handleResponse<AuthResponse>(response)
  }

  // Регистрация
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    })
    return this.handleResponse<AuthResponse>(response)
  }

  // Получить текущего пользователя
  // async getCurrentUser() {
  //   const response = await fetch(`${this.baseURL}/auth/me`, {
  //     headers: this.getHeaders(),
  //   })
  //   return this.handleResponse(response)
  // }

  // Товары
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${this.baseURL}/products`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse<Product[]>(response)
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const response = await fetch(`${this.baseURL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    })
    return this.handleResponse<Product>(response)
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await fetch(`${this.baseURL}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    })
    return this.handleResponse<Product>(response)
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    if (!response.ok) {
      throw new Error('Ошибка удаления товара')
    }
  }

  // Склад
  async getInventory(): Promise<InventoryItem[]> {
    const response = await fetch(`${this.baseURL}/inventory`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse<InventoryItem[]>(response)
  }

  async updateInventory(items: InventoryItem[]): Promise<InventoryItem[]> {
    const response = await fetch(`${this.baseURL}/inventory`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ items }),
    })
    return this.handleResponse<InventoryItem[]>(response)
  }

  // Операции
  async getOperations(): Promise<Operation[]> {
    const response = await fetch(`${this.baseURL}/operations`, {
      headers: this.getHeaders(),
    })
    return this.handleResponse<Operation[]>(response)
  }

  async createOperation(operation: Omit<Operation, 'id'>): Promise<Operation> {
    const response = await fetch(`${this.baseURL}/operations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(operation),
    })
    return this.handleResponse<Operation>(response)
  }
}

export const apiClient = new ApiClient()
export default apiClient

