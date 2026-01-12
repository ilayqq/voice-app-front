import { Link, useLocation } from 'react-router-dom'
import './Layout.css'

type Props = {
    title: string
    children: React.ReactNode
    showBack?: boolean
}

export default function Layout({ title, children, showBack = false }: Props) {
    const location = useLocation()
    const currentPath = location.pathname

    return (
        <div className="layout">
            <header className="header">
                {showBack && currentPath !== '/' && (
                    <Link to="/" className="back-button">←</Link>
                )}
                <h1>{title}</h1>
            </header>

            <main className="content">
                {children}
            </main>

            <nav className="bottom-nav">
                <Link to="/" className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
                    <span className="nav-icon">📊</span>
                    <span>Склад</span>
                </Link>
                <Link to="/products" className={`nav-item ${currentPath === '/products' ? 'active' : ''}`}>
                    <span className="nav-icon">📦</span>
                    <span>Товары</span>
                </Link>
                <Link to="/incoming" className={`nav-item ${currentPath === '/incoming' ? 'active' : ''}`}>
                    <span className="nav-icon">⬇️</span>
                    <span>Приход</span>
                </Link>
                <Link to="/outgoing" className={`nav-item ${currentPath === '/outgoing' ? 'active' : ''}`}>
                    <span className="nav-icon">⬆️</span>
                    <span>Расход</span>
                </Link>
                <Link to="/profile" className={`nav-item ${currentPath === '/profile' ? 'active' : ''}`}>
                    <span className="nav-icon">👤</span>
                    <span>Профиль</span>
                </Link>
            </nav>
        </div>
    )
}