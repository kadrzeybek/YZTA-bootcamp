// Markaya uygun loading animasyonları — sıradan spinner yerine
// zıplayan renk blokları ve neo-brutalist skeleton kartlar.
import { motion } from 'framer-motion'

const COLORS = ['bg-pink', 'bg-lemon', 'bg-claude', 'bg-lime', 'bg-electric']

export function BouncingBlocks({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-2">
        {COLORS.map((color, i) => (
          <motion.div
            key={color}
            className={`h-5 w-5 rounded-md border-2 border-ink ${color}`}
            animate={{ y: [0, -18, 0] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.12,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      {label && (
        <p className="font-display text-sm font-bold uppercase tracking-widest text-ink/70">
          {label}
        </p>
      )}
    </div>
  )
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <BouncingBlocks label={label} />
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card-brutal animate-pulse-slow p-5">
      <div className="mb-4 h-6 w-2/3 rounded-lg bg-ink/10" />
      <div className="mb-2 h-4 w-full rounded-lg bg-ink/10" />
      <div className="mb-2 h-4 w-5/6 rounded-lg bg-ink/10" />
      <div className="mt-5 flex gap-2">
        <div className="h-7 w-16 rounded-full bg-pink/20" />
        <div className="h-7 w-20 rounded-full bg-lemon/40" />
      </div>
    </div>
  )
}
