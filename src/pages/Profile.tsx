import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher.tsx'
import { motion, type Variants } from 'framer-motion'

export default function Profile() {
    const { user, logout } = useAuth()
    const { t } = useTranslation()

    const handleLogout = () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            logout()
        }
    }

    const initials =
        user?.name?.[0]?.toUpperCase() ||
        user?.phone_number?.[0]?.toUpperCase() ||
        'U'

    const displayName = user?.name || user?.phone_number || 'Пользователь'

    return (
        <Layout title={t('profile.title')} showBack>
            <div className="relative isolate px-6 pt-4 lg:px-8 text-white">

                {/* TOP GRADIENT BLUR */}
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

                {/* CONTENT */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={pageVariants}
                    className="mx-auto max-w-6xl space-y-6"
                >

                    {/* AVATAR + NAME */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-3 pt-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.06 }}
                            className="flex h-20 w-20 items-center justify-center rounded-full
                                       bg-indigo-500/30 ring-2 ring-indigo-400/50
                                       text-3xl font-bold shadow-lg"
                        >
                            {initials}
                        </motion.div>
                        <div className="text-center">
                            <div className="text-xl font-semibold">{displayName}</div>
                            {user?.phone_number && (
                                <div className="text-sm text-gray-400">{user.phone_number}</div>
                            )}
                        </div>
                    </motion.div>

                    {/* INFO SECTION */}
                    <motion.div
                        variants={itemVariants}
                        className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20 space-y-4"
                    >
                        <h2 className="text-lg font-semibold">Информация</h2>
                        <div className="divide-y divide-white/10">
                            <InfoRow label="Имя" value={user?.name || '—'} />
                            <InfoRow label="Телефон" value={user?.phone_number || '—'} />
                            <InfoRow label="Роль" value="Администратор" />
                        </div>
                    </motion.div>

                    {/* LANGUAGE */}
                    <motion.div
                        variants={itemVariants}
                        className="rounded-xl bg-white/10 p-6 ring-1 ring-white/20 space-y-3"
                    >
                        <h2 className="text-lg font-semibold">Язык интерфейса</h2>
                        <LanguageSwitcher />
                    </motion.div>

                    {/* LOGOUT */}
                    <motion.div variants={itemVariants}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className="w-full rounded-md bg-rose-500/80 py-3 text-center
                                       font-semibold hover:bg-rose-500 transition-colors"
                        >
                            {t('profile.logout')}
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* BOTTOM GRADIENT BLUR */}
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

const pageVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
}

/* ---------- UI ---------- */

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-400">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    )
}