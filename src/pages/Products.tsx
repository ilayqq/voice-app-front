import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import type { Product } from '../types'
import apiClient from '../services/api'
import { motion, type Variants } from 'framer-motion'

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    useEffect(() => {
        apiClient.getProducts().then(setProducts)
    }, [])

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = (id?: number) => {
        if (confirm('Удалить товар?')) {
            setProducts(products.filter(p => p.id !== id))
        }
    }

    return (
        <Layout title="Товары" showBack>
            <div className="relative isolate px-6 pt-14 lg:px-8 text-white">

                {/* TOP BLUR */}
                <GradientTop />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={pageVariants}
                    className="mx-auto max-w-6xl space-y-8"
                >
                    {/* SEARCH + ACTION */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <input
                            type="text"
                            placeholder="Поиск товара..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:max-w-sm rounded-md bg-white/10 px-4 py-2
                                       ring-1 ring-white/20 placeholder-gray-400
                                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />

                        {!showForm && (
                            <button
                                onClick={() => {
                                    setEditingProduct(null)
                                    setShowForm(true)
                                }}
                                className="rounded-md bg-indigo-500 px-5 py-2 font-semibold
                                           hover:bg-indigo-400 transition"
                            >
                                ➕ Добавить товар
                            </button>
                        )}
                    </motion.div>

                    {/* FORM */}
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 16 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20"
                        >
                            <ProductForm
                                product={editingProduct}
                                onSave={async product => {
                                    if (editingProduct) {
                                        setProducts(products.map(p =>
                                            p.id === product.id ? product : p
                                        ))
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
                        </motion.div>
                    )}

                    {/* LIST */}
                    {!showForm && (
                        <motion.div
                            variants={staggerVariants}
                            className="grid gap-4"
                        >
                            {filteredProducts.length === 0 ? (
                                <motion.div
                                    variants={itemVariants}
                                    className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20 text-center text-gray-300"
                                >
                                    {searchTerm ? 'Товары не найдены' : 'Нет товаров'}
                                </motion.div>
                            ) : (
                                filteredProducts.map(product => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                        className="flex items-center justify-between gap-4
                                                   rounded-xl bg-white/10 p-5 ring-1 ring-white/20"
                                    >
                                        <div className="space-y-1">
                                            <div className="text-lg font-semibold">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                {product.barcode}
                                                {product.category && ` • ${product.category}`}
                                            </div>
                                            {product.description && (
                                                <div className="text-sm text-gray-400">
                                                    {product.description}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product)
                                                    setShowForm(true)
                                                }}
                                                className="rounded-md bg-white/10 px-3 py-2
                                                           ring-1 ring-white/20 hover:bg-white/20"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="rounded-md bg-red-500/20 px-3 py-2
                                                           ring-1 ring-red-500/30 hover:bg-red-500/30"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    )}
                </motion.div>

                {/* BOTTOM BLUR */}
                <GradientBottom />
            </div>
        </Layout>
    )
}

/* ---------- animations ---------- */

const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
}

const staggerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: 'easeOut' },
    },
}

/* ---------- form ---------- */

function ProductForm({
                         product,
                         onSave,
                         onCancel,
                     }: {
    product: Product | null
    onSave: (product: Product) => void
    onCancel: () => void
}) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        barcode: product?.barcode || '',
        category: product?.category || '',
        description: product?.description || '',
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ ...formData })
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <input
                placeholder="Название товара *"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-md bg-white/10 px-4 py-2 ring-1 ring-white/20"
            />
            <input
                placeholder="Артикул *"
                value={formData.barcode}
                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                required
                className="w-full rounded-md bg-white/10 px-4 py-2 ring-1 ring-white/20"
            />
            <input
                placeholder="Категория"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md bg-white/10 px-4 py-2 ring-1 ring-white/20"
            />
            <textarea
                placeholder="Описание"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-md bg-white/10 px-4 py-2 ring-1 ring-white/20"
            />

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md bg-white/10 px-4 py-2 ring-1 ring-white/20"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-5 py-2 font-semibold hover:bg-indigo-400"
                >
                    Сохранить
                </button>
            </div>
        </form>
    )
}

/* ---------- gradients ---------- */

function GradientTop() {
    return (
        <div
            aria-hidden
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
            <div
                className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5
                           -translate-x-1/2 rotate-30 bg-linear-to-tr
                           from-[#ff80b5] to-[#9089fc] opacity-30"
            />
        </div>
    )
}

function GradientBottom() {
    return (
        <div
            aria-hidden
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl"
        >
            <div
                className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5
                           -translate-x-1/2 bg-linear-to-tr
                           from-[#ff80b5] to-[#9089fc] opacity-30"
            />
        </div>
    )
}
