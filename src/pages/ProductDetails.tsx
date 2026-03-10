import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import apiClient from "../services/api"
import type { Product } from "../types"
import { motion } from "framer-motion"

export default function ProductDetails() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        if (!id) return

        apiClient.getProductByBarcode(id)
            .then(setProduct)
            .catch(console.error)

    }, [id])

    const handleDelete = async () => {

        if (!product) return

        if (confirm("Удалить товар?")) {

            await apiClient.deleteProduct(product.barcode)

            navigate("/products")
        }
    }

    if (!product) {
        return <Layout title="Товар">Loading...</Layout>
    }

    return (

        <Layout title={product.name} showBack>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto space-y-6"
            >

                <div
                    className="
                      rounded-2xl
                      bg-white/10
                      backdrop-blur-md
                      p-6
                      ring-1
                      ring-white/20
                      space-y-3
                    "
                >

                    <h2 className="text-xl font-semibold">
                        {product.name}
                    </h2>

                    <p className="text-gray-300">
                        📦 {product.barcode}
                    </p>

                    {product.category && (
                        <p className="text-gray-400">
                            Категория: {product.category}
                        </p>
                    )}

                    {product.description && (
                        <p className="text-gray-400">
                            {product.description}
                        </p>
                    )}

                </div>


                {/* ACTIONS */}

                <div className="flex gap-4">

                    <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="
            flex-1
            rounded-lg
            bg-indigo-500
            py-3
            font-semibold
            hover:bg-indigo-400
            transition
          "
                    >
                        ✏️ Редактировать
                    </button>

                    <button
                        onClick={handleDelete}
                        className="
            flex-1
            rounded-lg
            bg-red-500
            py-3
            font-semibold
            hover:bg-red-400
            transition
          "
                    >
                        🗑 Удалить
                    </button>

                </div>

            </motion.div>

        </Layout>
    )
}