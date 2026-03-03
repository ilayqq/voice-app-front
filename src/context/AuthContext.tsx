import {createContext, useContext, useState, useEffect, type ReactNode} from 'react'
import { apiClient } from '../services/api'
import type { AuthResponse } from '../services/api'

interface User {
  id: string
  phone_number: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (phoneNumber: string, password: string) => Promise<void>
  register: (phoneNumber: string, password: string, name?: string) => Promise<void>
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
        setUser({ id: 'temp', phone_number: 'temp' })
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (phone_number: string, password: string) => {
    const response: AuthResponse = await apiClient.login({ phone_number, password })
    localStorage.setItem('auth_token', response.token)
    const user = response.user || { id: phone_number, email: phone_number, name: phone_number }
    setUser(user)
  }

  const register = async (phone_number: string, password: string, name?: string) => {
    try {
      const response: AuthResponse = await apiClient.register({ phone_number, password, name })
      localStorage.setItem('auth_token', response.token)
      const user = response.user || { id: phone_number, email: phone_number, name: name }
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

