import {useEffect, useState} from 'react'
import Layout from '../components/Layout'
import type { Product } from '../types'
import './Products.css'
import apiClient from "../services/api.ts";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    useEffect(() => {
        apiClient.getProducts().then(data => {
            setProducts(data)
        })
    }, [])

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = (id: number | undefined) => {
        if (confirm('Удалить товар?')) {
            setProducts(products.filter(p => p.id !== id))
        }
    }

    return (
        <Layout title="Товары" showBack>
            <div className="products-page">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Поиск товара..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {!showForm && (
                    <button className="primary" onClick={() => {
                        setEditingProduct(null)
                        setShowForm(true)
                    }}>
                        ➕ Добавить товар
                    </button>
                )}

                {showForm && (
                    <ProductForm
                        product={editingProduct}
                        onSave={async (product) => {
                            if (editingProduct) {
                                setProducts(products.map(p => p.id === product.id ? product : p))
                            } else {
                                const created = await apiClient.createProduct(product)
                                setProducts(prev => [...prev, created])
                            }
                            setShowForm(false)
                            setEditingProduct(null)
                        }}
                        onCancel={() => {
                            setShowForm(false)
                            setEditingProduct(null)
                        }}
                    />
                )}

                {!showForm && (
                    <div className="products-list">
                        {filteredProducts.length === 0 ? (
                            <div className="empty-state">
                                <p>{searchTerm ? 'Товары не найдены' : 'Нет товаров'}</p>
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <div className="product-info">
                                        <div className="product-name">{product.name}</div>
                                        <div className="product-details">
                                            <span>Артикул: {product.barcode}</span>
                                            <span>•</span>
                                            <span>{product.category}</span>
                                            <span>•</span>
                                            {/*<span>{product.price} ₸/{product.unit}</span>*/}
                                        </div>
                                        {product.description && (
                                            <div className="product-description">{product.description}</div>
                                        )}
                                    </div>
                                    <div className="product-actions">
                                        <button
                                            className="icon-button"
                                            onClick={() => {
                                                setEditingProduct(product)
                                                setShowForm(true)
                                            }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="icon-button"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Layout>
    )
}

function ProductForm({ product, onSave, onCancel }: {
    product: Product | null
    onSave: (product: Product) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        barcode: product?.barcode || '',
        // unit: product?.unit || 'шт',
        category: product?.category || '',
        // price: product?.price || 0,
        description: product?.description || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.barcode) {
            alert('Заполните обязательные поля')
            return
        }

        onSave({
            name: formData.name,
            barcode: formData.barcode,
            category: formData.category,
            description: formData.description
        })
    }

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <input
                type="text"
                placeholder="Название товара *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Артикул *"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                required
            />
            {/*<input*/}
            {/*    type="text"*/}
            {/*    placeholder="Единица измерения (шт, кг, л)"*/}
            {/*    value={formData.unit}*/}
            {/*    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}*/}
            {/*/>*/}
            <input
                type="text"
                placeholder="Категория"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            {/*<input*/}
            {/*    type="number"*/}
            {/*    placeholder="Цена"*/}
            {/*    value={formData.price}*/}
            {/*    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}*/}
            {/*    step="0.01"*/}
            {/*/>*/}
            <textarea
                placeholder="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
            />
            <div className="form-actions">
                <button type="button" className="secondary" onClick={onCancel}>
                    Отмена
                </button>
                <button type="submit" className="primary">
                    Сохранить
                </button>
            </div>
        </form>
    )
}

