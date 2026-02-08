import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import type { Product } from '../types'
import VoiceRecorder from '../components/VoiceRecorder'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import apiClient from '../services/api'
import { motion } from 'framer-motion'

export default function Dashboard() {
    const { t } = useTranslation()
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        apiClient.getProducts().then(setProducts)
    }, [])

    const totalProducts = products.length

    return (
        <Layout title={t('dashboard.title')}>
            <div className="relative isolate px-6 pt-14 lg:px-8 text-white">

                {/* 🔥 TOP GRADIENT BLUR (как в Login) */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5
                       -translate-x-1/2 rotate-30 bg-linear-to-tr
                       from-[#ff80b5] to-[#9089fc] opacity-30
                       sm:left-[calc(50%-30rem)] sm:w-288.75"
                    />
                </div>

                {/* ✨ CONTENT */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={pageVariants}
                    className="mx-auto max-w-6xl space-y-10"
                >
                    {/* VOICE */}
                    {/*<motion.div*/}
                    {/*    variants={itemVariants}*/}
                    {/*    className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20"*/}
                    {/*>*/}
                    {/*    <VoiceRecorder />*/}
                    {/*</motion.div>*/}

                    {/* STATS */}
                    <motion.div
                        variants={staggerVariants}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
                    >
                        <StatCard value={totalProducts} label={t('dashboard.products')} />
                        <StatCard value="0 ₸" label="Оборот" />
                        <StatCard value={0} label="Низкий остаток" />
                        <StatCard value={0} label="Операций сегодня" />
                    </motion.div>

                    {/* ACTIONS */}
                    <motion.div
                        variants={staggerVariants}
                        className="grid gap-4 sm:grid-cols-3"
                    >
                        <ActionButton to="/incoming">Приход товара</ActionButton>
                        <ActionButton to="/outgoing">Расход товара</ActionButton>
                        <ActionButton to="/products">Новый товар</ActionButton>
                    </motion.div>

                    {/* LAST OPS */}
                    <motion.div
                        variants={itemVariants}
                        className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20"
                    >
                        <h2 className="text-lg font-semibold">
                            Последние операции
                        </h2>
                    </motion.div>
                </motion.div>

                {/* 🔥 BOTTOM GRADIENT BLUR */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5
                       -translate-x-1/2 bg-linear-to-tr
                       from-[#ff80b5] to-[#9089fc] opacity-30
                       sm:left-[calc(50%+36rem)] sm:w-288.75"
                    />
                </div>
            </div>
        </Layout>
    )
}

/* ---------- animations ---------- */

const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
}

const staggerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
}

/* ---------- UI ---------- */

function StatCard({ value, label }: { value: React.ReactNode; label: string }) {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            className="rounded-xl bg-white/10 p-5 ring-1 ring-white/20"
        >
            <div className="text-2xl font-semibold">{value}</div>
            <div className="text-sm text-gray-300">{label}</div>
        </motion.div>
    )
}

function ActionButton({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <Link
                to={to}
                className="block rounded-md bg-indigo-500 py-3 text-center font-semibold hover:bg-indigo-400"
            >
                {children}
            </Link>
        </motion.div>
    )
}
