import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '../services/api'
import type { AuthResponse } from '../services/api'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phoneNumber: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // Если токен есть, считаем пользователя авторизованным
        setUser({ id: 'temp', email: 'temp' })
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (phoneNumber: string, password: string) => {
    const response: AuthResponse = await apiClient.login({ phoneNumber, password })
    console.log('Login response:', response)
    localStorage.setItem('auth_token', response.token)
    console.log('Token saved to localStorage')
    // Если user не приходит с сервера, создаем временного
    const user = response.user || { id: phoneNumber, email: phoneNumber, name: phoneNumber }
    setUser(user)
    console.log('User set:', user)
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response: AuthResponse = await apiClient.register({ email, password, name })
      localStorage.setItem('auth_token', response.token)
      // Если user не приходит с сервера, создаем временного
      const user = response.user || { id: email, email: email, name: name }
      setUser(user)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

