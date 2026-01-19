import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import { useEffect, useState } from 'react'
import './i18n'

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Загрузка...
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <div style={{ padding: '20px' }}>
              <h1>Dashboard (временная заглушка)</h1>
              <button onClick={() => {
                localStorage.removeItem('auth_token')
                window.location.reload()
              }}>
                Выйти
              </button>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    document.documentElement.setAttribute('data-theme', theme)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
