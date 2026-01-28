import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import type { Product } from '../types'
import './Dashboard.css'
import VoiceRecorder from "../components/VoiceRecorder.tsx";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import apiClient from "../services/api.ts";

export default function Dashboard() {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        apiClient.getProducts().then(data => {
            setProducts(data)
        })
    }, [])

    const totalProducts = products.length

    return (
        <Layout title={t("dashboard.title")}>
            <div className="dashboard">

                <VoiceRecorder />

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{totalProducts}</div>
                        <div className="stat-label">{t("dashboard.products")}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{0} ₸</div>
                        <div className="stat-label">Оборот</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{0}</div>
                        <div className="stat-label">Низкий остаток</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{0}</div>
                        <div className="stat-label">Операций сегодня</div>
                    </div>
                </div>

                <div className="quick-actions">
                    <Link to="/incoming" className="action-button incoming">
                        Приход товара
                    </Link>
                    <Link to="/outgoing" className="action-button outgoing">
                        Расход товара
                    </Link>
                    <Link to="/products" className="action-button">
                        Новый товар
                    </Link>
                </div>

                <div className="section">
                    <h2 className="section-title">Последние операции</h2>
                </div>
            </div>
        </Layout>
    )
}

