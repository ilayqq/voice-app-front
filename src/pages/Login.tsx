import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
              style={{
                clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              Announcing our next round of funding.{' '}
              <a href="#" className="font-semibold text-indigo-400">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              Speak Stock
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
              {/*Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet*/}
              {/*fugiat veniam occaecat.*/}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                  href="#"
                  className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </a>
              <a href="#" className="text-sm/6 font-semibold text-white">
                Sign out <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
              style={{
                clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
          />
        </div>
      </div>
    // <div className="login-container">
    //   <div className="login-card">
    //
    //     <div className="login-header">
    //       <h1>{isLogin ? t('login.title') : t('login.register_title')}</h1>
    //     </div>
    //
    //     <form onSubmit={handleSubmit} className="login-form">
    //       {!isLogin && (
    //         <div className="form-group">
    //           <input
    //             type="text"
    //             placeholder={t('login.name_placeholder')}
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //             className="form-input"
    //           />
    //         </div>
    //       )}
    //
    //       <div className="form-group">
    //         <input
    //           type="tel"
    //           placeholder={t('login.phone_placeholder')}
    //           value={phoneNumber}
    //           onChange={(e) => setPhoneNumber(e.target.value)}
    //           required
    //           className="form-input"
    //         />
    //       </div>
    //
    //       <div className="form-group">
    //         <input
    //           type="password"
    //           placeholder={t('login.password_placeholder')}
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //           minLength={6}
    //           className="form-input"
    //         />
    //       </div>
    //
    //       {error && <div className="error-message">{error}</div>}
    //
    //       <button
    //         type="submit"
    //         className="primary login-button"
    //         disabled={loading}
    //       >
    //         {loading ? t('login.loading') : isLogin ? t('login.login_button') : t('login.register_button')}
    //       </button>
    //     </form>
    //
    //     <div className="login-footer">
    //       <button
    //         type="button"
    //         className="link-button"
    //         onClick={() => {
    //           setIsLogin(!isLogin)
    //           setError('')
    //         }}
    //       >
    //         {isLogin
    //           ? t('login.no_account')
    //           : t('login.have_account')}
    //       </button>
    //     </div>
    //   </div>
    // </div>
  )
}
