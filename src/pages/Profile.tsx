import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import API_CONFIG from '../config/api'
import './Profile.css'

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
                                <div className="setting-label">Backend API URL</div>
                                <div className="setting-value">{API_CONFIG.getBaseURL()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="primary logout-button" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        </Layout>
    )
}
