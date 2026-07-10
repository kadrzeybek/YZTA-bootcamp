import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MARQUEE_ITEMS = [
  'GÖRSEL PROMPT ÜRETİMİ',
  'SEO UYUMLU METİN',
  'AI ORKESTRASYONU',
  'SANİYELER İÇİNDE',
  '2 AJAN, 1 AKIŞ',
]

const STEPS = [
  {
    emoji: '🎨',
    title: 'Designer Agent',
    color: 'bg-pink text-white',
    text: 'Ürün bilgini profesyonel, Midjourney/DALL-E kalitesinde bir görsel üretim promptuna dönüştürür.',
  },
  {
    emoji: '✍️',
    title: 'Copywriter Agent',
    color: 'bg-lemon text-ink',
    text: 'Görsel prompt + ürün bilgisinden SEO uyumlu başlık, açıklama ve anahtar kelimeler yazar.',
  },
  {
    emoji: '🚀',
    title: 'Tek Tıkla Sonuç',
    color: 'bg-claude text-white',
    text: 'Orkestrasyon motoru iki ajanı zincirler; sen sadece kopyala, yapıştır, sat.',
  },
]

export default function Landing() {
  const { user } = useAuth()
  const cta = user ? '/products/new' : '/register'

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        {/* Arka plan blob'ları */}
        <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 animate-blob rounded-full bg-gradient-to-br from-pink/40 to-electric/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 animate-blob rounded-full bg-gradient-to-tr from-lemon/50 to-lime/30 blur-3xl [animation-delay:3s]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <span className="badge bg-lemon">✦ E-ticaret satıcıları için</span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
            Ürününü anlat,
            <br />
            <span className="bg-gradient-to-r from-pink via-claude to-electric bg-clip-text text-transparent">
              gerisini ajanlar
            </span>{' '}
            halletsin.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-medium text-ink/70 sm:text-xl">
            OrkestrAI, ürün bilgini alır; bir ajan profesyonel görsel üretim
            promptu yazar, diğeri SEO uyumlu pazarlama metnini üretir. Stüdyo
            bütçesi yok, saatlerce metin derdi yok.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <motion.div whileHover={{ rotate: -1.5 }} whileTap={{ scale: 0.97 }}>
              <Link to={cta} className="btn-pink px-8 py-4 text-lg">
                Hemen Dene →
              </Link>
            </motion.div>
            {!user && (
              <Link to="/login" className="btn-white">
                Zaten üyeyim
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="border-y-[3px] border-ink bg-ink py-3">
        <div className="flex w-max animate-marquee gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className={`whitespace-nowrap font-display text-sm font-bold tracking-widest ${
                  i % 2 === 0 ? 'text-lemon' : 'text-pink'
                }`}
              >
                {item} <span className="text-white">✦</span>
              </span>
            ),
          )}
        </div>
      </div>

      {/* NASIL ÇALIŞIR */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
          Nasıl çalışır<span className="text-pink">?</span>
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }}
              className="card-brutal p-6"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl border-[3px] border-ink text-2xl ${step.color}`}
              >
                {step.emoji}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">
                {i + 1}. {step.title}
              </h3>
              <p className="mt-2 font-medium text-ink/70">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ALT CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card-brutal relative overflow-hidden bg-gradient-to-br from-pink via-claude to-electric p-10 text-center sm:p-16"
        >
          <h2 className="font-display text-3xl font-bold text-white drop-shadow-[3px_3px_0_rgba(10,10,10,0.9)] sm:text-5xl">
            Vitrinini AI ile parlat.
          </h2>
          <p className="mx-auto mt-4 max-w-md font-medium text-white/90">
            Ücretsiz kayıt ol, ilk ürününü 1 dakikada oluştur.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to={cta} className="btn-lemon px-8 py-4 text-lg">
              Hemen Başla ✦
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
