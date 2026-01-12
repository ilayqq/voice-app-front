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
        // try {
        //   const userData = await apiClient.getCurrentUser()
        //   setUser(userData.user || userData)
        // } catch (error) {
        //   console.error('Auth check failed:', error)
        //   localStorage.removeItem('auth_token')
        // }
      }
      setIsLoading(false)
    }
    
    checkAuth().then(() => setIsLoading(false))
  }, [])

  const login = async (phoneNumber: string, password: string) => {
    const response: AuthResponse = await apiClient.login({ phoneNumber, password })
    localStorage.setItem('auth_token', response.token)
    setUser(response.user)
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response: AuthResponse = await apiClient.register({ email, password, name })
      localStorage.setItem('auth_token', response.token)
      setUser(response.user)
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

