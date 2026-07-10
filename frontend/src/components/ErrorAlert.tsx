import { motion } from 'framer-motion'

export default function ErrorAlert({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="rounded-xl border-[3px] border-ink bg-pink/10 px-4 py-3 shadow-brutal-sm"
      role="alert"
    >
      <p className="font-bold text-pink-dark">⚠ {message}</p>
    </motion.div>
  )
}
