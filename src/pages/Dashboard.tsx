import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Product, InventoryItem, Operation, ProductWithInventory } from '../types'
import './Dashboard.css'

export default function Dashboard() {
    const [products] = useLocalStorage<Product[]>('products', [])
    const [inventory] = useLocalStorage<InventoryItem[]>('inventory', [])
    const [operations] = useLocalStorage<Operation[]>('operations', [])

    const productsWithInventory: ProductWithInventory[] = products.map(product => {
        const inv = inventory.find(i => i.productId === product.id)
        return {
            ...product,
            quantity: inv?.quantity || 0,
            reserved: inv?.reserved || 0,
            available: (inv?.quantity || 0) - (inv?.reserved || 0)
        }
    })

    const totalProducts = products.length
    const totalValue = productsWithInventory.reduce((sum, p) => sum + (p.quantity * p.price), 0)
    const lowStock = productsWithInventory.filter(p => p.available < 10).length
    const todayOperations = operations.filter(op => {
        const today = new Date().toISOString().split('T')[0]
        return op.date.startsWith(today)
    }).length

    const recentOperations = operations.slice(-5).reverse()

    return (
        <Layout title="Склад">
            <div className="dashboard">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{totalProducts}</div>
                        <div className="stat-label">Товаров</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{totalValue.toLocaleString()} ₽</div>
                        <div className="stat-label">Оборот</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{lowStock}</div>
                        <div className="stat-label">Низкий остаток</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{todayOperations}</div>
                        <div className="stat-label">Операций сегодня</div>
                    </div>
                </div>

                <div className="quick-actions">
                    <Link to="/incoming" className="action-button incoming">
                        ⬇️ Приход товара
                    </Link>
                    <Link to="/outgoing" className="action-button outgoing">
                        ⬆️ Расход товара
                    </Link>
                    <Link to="/products" className="action-button">
                        ➕ Новый товар
                    </Link>
                </div>

                <div className="section">
                    <h2 className="section-title">Остатки на складе</h2>
                    {productsWithInventory.length === 0 ? (
                        <div className="empty-state">
                            <p>Нет товаров на складе</p>
                            <Link to="/products" className="primary">Добавить товар</Link>
                        </div>
                    ) : (
                        <div className="inventory-list">
                            {productsWithInventory.slice(0, 10).map(item => (
                                <Link key={item.id} to={`/products`} className="inventory-item">
                                    <div className="item-info">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-sku">{item.sku}</div>
                                    </div>
                                    <div className="item-quantity">
                                        <div className={`quantity-badge ${item.available < 10 ? 'low' : ''}`}>
                                            {item.available} {item.unit}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {productsWithInventory.length > 10 && (
                                <Link to="/products" className="view-all">Показать все →</Link>
                            )}
                        </div>
                    )}
                </div>

                <div className="section">
                    <h2 className="section-title">Последние операции</h2>
                    {recentOperations.length === 0 ? (
                        <div className="empty-state">
                            <p>Нет операций</p>
                        </div>
                    ) : (
                        <div className="operations-list">
                            {recentOperations.map(op => {
                                const product = products.find(p => p.id === op.productId)
                                return (
                                    <div key={op.id} className={`operation-item ${op.type}`}>
                                        <div className="operation-icon">
                                            {op.type === 'incoming' ? '⬇️' : '⬆️'}
                                        </div>
                                        <div className="operation-info">
                                            <div className="operation-product">{product?.name || 'Неизвестно'}</div>
                                            <div className="operation-meta">
                                                {new Date(op.date).toLocaleDateString('ru-RU')}
                                            </div>
                                        </div>
                                        <div className={`operation-quantity ${op.type}`}>
                                            {op.type === 'incoming' ? '+' : '-'}{op.quantity}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    )
}

