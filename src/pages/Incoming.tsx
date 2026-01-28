import { useState } from 'react'
import Layout from '../components/Layout'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Product, InventoryItem, Operation } from '../types'
import './Operation.css'

export default function Incoming() {
    const [products] = useLocalStorage<Product[]>('products', [])
    const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('inventory', [])
    const [operations, setOperations] = useLocalStorage<Operation[]>('operations', [])
    const [selectedProductId, setSelectedProductId] = useState('')
    const [quantity, setQuantity] = useState('')
    const [notes, setNotes] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProductId || !quantity || parseFloat(quantity) <= 0) {
            alert('Заполните все поля')
            return
        }

        const qty = parseFloat(quantity)
        const operation: Operation = {
            id: Date.now().toString(),
            type: 'incoming',
            productId: selectedProductId,
            quantity: qty,
            date: new Date().toISOString(),
            notes: notes || undefined
        }

        setOperations([...operations, operation])

        const existingItem = inventory.find(i => i.productId === selectedProductId)
        if (existingItem) {
            setInventory(inventory.map(i =>
                i.productId === selectedProductId
                    ? { ...i, quantity: i.quantity + qty }
                    : i
            ))
        } else {
            setInventory([...inventory, {
                productId: selectedProductId,
                quantity: qty,
                reserved: 0
            }])
        }

        setSelectedProductId('')
        setQuantity('')
        setNotes('')
        alert('Приход оформлен')
    }

    return (
        <Layout title="Приход товара" showBack>
            <form onSubmit={handleSubmit} className="operation-form">
                <label>
                    <div className="label-text">Товар *</div>
                    <select
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="">Выберите товар</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name} ({product.barcode})
                            </option>
                        ))}
                    </select>
                </label>

                {selectedProductId && (() => {
                    // const product = products.find(p => p.id === selectedProductId)
                    const inv = inventory.find(i => i.productId === selectedProductId)
                    return (
                        <div className="current-stock">
                            Текущий остаток: {inv?.quantity || 0} {'шт'}
                        </div>
                    )
                })()}

                <label>
                    <div className="label-text">Количество *</div>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="0"
                        className="form-input"
                    />
                    {selectedProductId && (() => {
                        // const product = products.find(p => p.id === selectedProductId)
                        return <div className="input-hint">Единица: {'шт'}</div>
                    })()}
                </label>

                <label>
                    <div className="label-text">Примечание</div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Дополнительная информация..."
                        rows={3}
                        className="form-textarea"
                    />
                </label>

                <button type="submit" className="primary">
                    Оформить приход
                </button>
            </form>
        </Layout>
    )
}

