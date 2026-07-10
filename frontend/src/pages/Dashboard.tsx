import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Product } from '../lib/types'
import { useAuth } from '../context/AuthContext'
import { SkeletonCard } from '../components/Loader'
import ErrorAlert from '../components/ErrorAlert'

const CARD_ACCENTS = [
  'from-pink/15 to-electric/10',
  'from-lemon/40 to-lime/10',
  'from-claude/20 to-pink/10',
]

export default function Dashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .listProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="badge bg-lemon">Panelin</span>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Merhaba,{' '}
            <span className="bg-gradient-to-r from-pink to-claude bg-clip-text text-transparent">
              {user?.email.split('@')[0]}
            </span>{' '}
            👋
          </h1>
          <Link to="/products/new" className="btn-pink">
            + Yeni Ürün Oluştur
          </Link>
        </div>
      </motion.div>

      <div className="mt-6">
        <ErrorAlert message={error} />
      </div>

      {products === null && !error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {products?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-brutal mt-10 bg-gradient-to-br from-lemon/50 to-pink/10 p-12 text-center"
        >
          <p className="text-5xl">🛍️</p>
          <h2 className="mt-4 font-display text-2xl font-bold">Henüz ürünün yok</h2>
          <p className="mx-auto mt-2 max-w-sm font-medium text-ink/60">
            İlk ürününü oluştur; ajanlar görsel promptunu ve pazarlama metnini
            saniyeler içinde hazırlasın.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/products/new" className="btn-pink">
              İlk Ürününü Oluştur →
            </Link>
          </div>
        </motion.div>
      )}

      {products && products.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
            >
              <Link
                to={`/products/${product.id}`}
                className={`card-brutal block h-full bg-gradient-to-br p-5 ${
                  CARD_ACCENTS[i % CARD_ACCENTS.length]
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold leading-snug">
                    {product.uretilen_baslik ?? `${product.renk} ${product.kategori}`}
                  </h3>
                  <span
                    className={`badge shrink-0 ${
                      product.uretilen_gorsel_prompt
                        ? 'bg-lime text-ink'
                        : 'bg-white text-ink/60'
                    }`}
                  >
                    {product.uretilen_gorsel_prompt ? 'Hazır' : 'Taslak'}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink/60">
                  {product.materyal} · {product.tarz} · {product.hedef_kitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="badge bg-pink/15">{product.kategori}</span>
                  <span className="badge bg-lemon/60">{product.renk}</span>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink/40">
                  {new Date(product.olusturulma_tarihi).toLocaleDateString('tr-TR')}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
