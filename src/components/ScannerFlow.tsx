import { useState } from "react"
import apiClient from "../services/api"
import type { Product } from "../types"
import BarcodeScanner from "./BarcodeScanner.tsx";

export default function ScannerFlow() {
    const [scanning, setScanning] = useState(false)
    const [foundProduct, setFoundProduct] = useState<Product | null>(null)
    const [barcode, setBarcode] = useState("")
    const [qty, setQty] = useState(1)
    const [notFound, setNotFound] = useState(false)

    const handleScan = async (code: string) => {
        // alert("Barcode scanned: " + code)
        setBarcode(code)
        setScanning(false)

        try {
            const product = await apiClient.getProductByBarcode(code)

            if (product) {
                setFoundProduct(product)
                setNotFound(false)
            } else {
                setFoundProduct(null)
                setNotFound(true)
            }
        } catch (error) {
            console.error("Failed to fetch product by barcode:", error)
            setNotFound(true)
        }
    }

    const handleIncoming = async () => {
        if (!foundProduct) return

        await apiClient.createProduct({
            name: foundProduct.name,
            barcode: foundProduct.barcode,
        })

        alert("Товар добавлен на склад")
        reset()
    }

    const handleCreateProduct = async () => {
        if (!barcode) return

        const created = await apiClient.createProduct({
            name: "Новый товар",
            barcode: barcode,
        })

        setFoundProduct(created)
        setNotFound(false)
    }

    const reset = () => {
        setFoundProduct(null)
        setBarcode("")
        setQty(1)
        setNotFound(false)
    }

    return (
        <div className="space-y-6">

            <button
                onClick={() => setScanning(true)}
                className="rounded-md bg-indigo-500 px-6 py-3 font-semibold"
            >
                📷 Сканировать товар
            </button>

            {scanning && (
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setScanning(false)}
                />
            )}

            {foundProduct && (
                <div className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20 space-y-4">
                    <h3 className="text-lg font-semibold">
                        {foundProduct.name}
                    </h3>
                    {barcode && (
                        <p className="text-gray-400">
                            Отсканировано: {barcode}
                        </p>
                    )}
                    <p className="text-gray-300">
                        Штрихкод: {foundProduct.barcode}
                    </p>

                    <input
                        type="number"
                        min={1}
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="w-full rounded-md bg-white/10 px-4 py-2 ring-1 ring-white/20"
                        placeholder="Сколько поступило?"
                    />

                    <button
                        onClick={handleIncoming}
                        className="rounded-md bg-green-500 px-4 py-2"
                    >
                        Подтвердить приход
                    </button>
                </div>
            )}

            {notFound && (
                <div className="rounded-xl bg-red-500/10 p-6 ring-1 ring-red-500/30 space-y-4">
                    <p>Товар с таким штрихкодом не найден</p>

                    <button
                        className="rounded-md bg-indigo-500 px-4 py-2"
                        onClick={handleCreateProduct}
                    >
                        ➕ Создать новый товар
                    </button>
                </div>
            )}
        </div>
    )
}