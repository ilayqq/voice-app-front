import { Link, useLocation } from 'react-router-dom'
import './Layout.css'
import {useTranslation} from "react-i18next";
import WarehouseIcon from '../assets/warehouseIcon.png'
import ProfileIcon from '../assets/profileIcon.png'
import ProductIcon from '../assets/productIcon.png'

type Props = {
    title: string
    children: React.ReactNode
    showBack?: boolean
}

export default function Layout({ title, children, showBack = false }: Props) {
    const { t } = useTranslation()
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
                    <span className="nav-icon"><img src={WarehouseIcon} alt={"warehouse icon"}/></span>
                    <span>{t('nav.warehouse')}</span>
                </Link>
                <Link to="/products" className={`nav-item ${currentPath === '/products' ? 'active' : ''}`}>
                    <span className="nav-icon"><img src={ProductIcon} alt={"product icon"}/></span>
                    <span>{t('nav.products')}</span>
                </Link>
                <Link to="/incoming" className={`nav-item ${currentPath === '/incoming' ? 'active' : ''}`}>
                    <span className="nav-icon"></span>
                    <span>{t('nav.incoming')}</span>
                </Link>
                <Link to="/outgoing" className={`nav-item ${currentPath === '/outgoing' ? 'active' : ''}`}>
                    <span className="nav-icon"></span>
                    <span>{t('nav.outgoing')}</span>
                </Link>
                <Link to="/profile" className={`nav-item ${currentPath === '/profile' ? 'active' : ''}`}>
                    <span className="nav-icon"><img src={ProfileIcon} alt={"profile icon"}/></span>
                    <span>{t("nav.profile")}</span>
                </Link>
            </nav>
        </div>
    )
}