// Giriş ve Kayıt için ortak sayfa — mode prop'u ile ayrışır.
import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ErrorAlert from '../components/ErrorAlert'
import { BouncingBlocks } from '../components/Loader'

export default function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await (isLogin ? login(email, password) : register(email, password))
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir şeyler ters gitti.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="pointer-events-none absolute right-0 top-10 h-48 w-48 animate-blob rounded-full bg-gradient-to-br from-lemon/60 to-pink/30 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-brutal relative p-8"
      >
        <span className={`badge ${isLogin ? 'bg-electric text-white' : 'bg-pink text-white'}`}>
          {isLogin ? '→ Tekrar hoş geldin' : '✦ Aramıza katıl'}
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </h1>
        <p className="mt-1 font-medium text-ink/60">
          {isLogin
            ? 'Panele dönüp ürünlerini yönet.'
            : 'Ücretsiz hesap aç, ilk içeriğini üret.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="label-brutal">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-brutal"
              placeholder="sen@magazan.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="label-brutal">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-brutal"
              placeholder="en az 6 karakter"
            />
          </div>

          <ErrorAlert message={error} />

          <button type="submit" disabled={busy} className="btn-pink w-full py-4">
            {busy ? (
              <BouncingBlocks />
            ) : isLogin ? (
              'Giriş Yap →'
            ) : (
              'Hesap Oluştur ✦'
            )}
          </button>
        </form>

        <p className="mt-6 text-center font-medium text-ink/60">
          {isLogin ? 'Hesabın yok mu?' : 'Zaten üye misin?'}{' '}
          <Link
            to={isLogin ? '/register' : '/login'}
            className="font-bold text-pink underline decoration-2 underline-offset-4 hover:text-pink-dark"
          >
            {isLogin ? 'Kayıt ol' : 'Giriş yap'}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
