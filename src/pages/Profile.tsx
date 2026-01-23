import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import './Profile.css'
import LanguageSwitcher from "../components/LanguageSwitcher.tsx";

export default function Profile() {
    const { user, logout } = useAuth()

    const handleLogout = () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            logout()
        }
    }

    return (
        <Layout title="Профиль" showBack>
            <div className="profile">
                <div className="avatar">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <h2>{user?.name || user?.email || 'Пользователь'}</h2>
                {user?.email && <div className="profile-email">{user.email}</div>}

                <div className="profile-section">
                    <h3 className="section-title">Информация</h3>
                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <div className="setting-label">Settings label</div>
                                <div className="setting-value">Settings value</div>
                            </div>
                        </div>
                    </div>
                </div>

                <LanguageSwitcher/>

                <button className="primary logout-button" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        </Layout>
    )
}
