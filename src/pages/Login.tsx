import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'
import './Login.css'

export default function Login() {
  const { t } = useTranslation()
  const [isLogin, setIsLogin] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await login(phoneNumber, password)
      } else {
        await register(phoneNumber, password, name || undefined)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <LanguageSwitcher />

        <div className="login-header">
          <h1>{isLogin ? t('login.title') : t('login.register_title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                placeholder={t('login.name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="tel"
              placeholder={t('login.phone_placeholder')}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder={t('login.password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="primary login-button"
            disabled={loading}
          >
            {loading ? t('login.loading') : isLogin ? t('login.login_button') : t('login.register_button')}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
          >
            {isLogin
              ? t('login.no_account')
              : t('login.have_account')}
          </button>
        </div>
      </div>
    </div>
  )
}
