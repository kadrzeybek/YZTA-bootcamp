// Multi-step ürün oluşturma akışı: 3 adım + üretim.
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import type { ProductInput } from '../lib/types'
import ErrorAlert from '../components/ErrorAlert'
import { BouncingBlocks } from '../components/Loader'

type Field = keyof ProductInput

interface StepDef {
  title: string
  emoji: string
  accent: string
  fields: { name: Field; label: string; placeholder: string }[]
}

const STEPS: StepDef[] = [
  {
    title: 'Ürünün Kimliği',
    emoji: '📦',
    accent: 'bg-pink text-white',
    fields: [
      { name: 'kategori', label: 'Kategori', placeholder: 'örn. kahve kupası, deri cüzdan' },
      { name: 'materyal', label: 'Materyal', placeholder: 'örn. seramik, %100 pamuk, meşe' },
    ],
  },
  {
    title: 'Görünüm & Tarz',
    emoji: '🎨',
    accent: 'bg-lemon text-ink',
    fields: [
      { name: 'tarz', label: 'Tarz', placeholder: 'örn. minimalist, vintage, boho' },
      { name: 'renk', label: 'Renk', placeholder: 'örn. mat siyah, pastel pembe' },
    ],
  },
  {
    title: 'Kime, Ne İçin?',
    emoji: '🎯',
    accent: 'bg-claude text-white',
    fields: [
      {
        name: 'kullanim_amaci',
        label: 'Kullanım Amacı',
        placeholder: 'örn. günlük kahve keyfi, hediye',
      },
      {
        name: 'hedef_kitle',
        label: 'Hedef Kitle',
        placeholder: 'örn. genç profesyoneller, yeni anneler',
      },
    ],
  },
]

const EMPTY: ProductInput = {
  materyal: '',
  tarz: '',
  renk: '',
  kategori: '',
  kullanim_amaci: '',
  hedef_kitle: '',
}

export default function CreateProduct() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ProductInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)

  const current = STEPS[step]
  const stepValid = current.fields.every((f) => form[f.name].trim().length > 0)
  const isLast = step === STEPS.length - 1

  function setField(name: Field, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit() {
    setError(null)
    setGenerating(true)
    try {
      const product = await api.createProduct(form)
      await api.generate(product.id)
      navigate(`/products/${product.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir şeyler ters gitti.')
      setGenerating(false)
    }
  }

  if (generating && !error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-brutal bg-gradient-to-br from-lemon/40 via-white to-pink/10 p-10 text-center"
        >
          <BouncingBlocks />
          <h2 className="mt-6 font-display text-2xl font-bold">
            Ajanlar sahnede 🎭
          </h2>
          <p className="mt-2 max-w-sm font-medium text-ink/60">
            Designer görsel promptunu yazıyor, ardından Copywriter SEO metnini
            kaleme alıyor. Bu birkaç saniye sürebilir…
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <span className="badge bg-lemon">Yeni ürün</span>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
        Ürününü Anlat
      </h1>

      {/* Adım göstergesi */}
      <div className="mt-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.title}
            onClick={() => i < step && setStep(i)}
            className={`h-3 flex-1 rounded-full border-2 border-ink transition-colors ${
              i < step ? 'bg-lime' : i === step ? 'bg-pink' : 'bg-white'
            } ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
            aria-label={`Adım ${i + 1}: ${s.title}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="card-brutal mt-6 p-8"
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-ink text-xl ${current.accent}`}
            >
              {current.emoji}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
                Adım {step + 1} / {STEPS.length}
              </p>
              <h2 className="font-display text-xl font-bold">{current.title}</h2>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {current.fields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className="label-brutal">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  value={form[field.name]}
                  onChange={(e) => setField(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="input-brutal"
                  autoFocus={field === current.fields[0]}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <ErrorAlert message={error} />
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-white disabled:invisible"
            >
              ← Geri
            </button>
            {isLast ? (
              <button onClick={handleSubmit} disabled={!stepValid} className="btn-pink">
                Üret ✦
              </button>
            ) : (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!stepValid}
                className="btn-lemon"
              >
                Devam →
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
