import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to={user ? '/dashboard' : '/'}
          className="font-display text-xl font-bold tracking-tight sm:text-2xl"
        >
          Orkestr<span className="text-pink">AI</span>
          <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-lemon ring-2 ring-ink" />
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full border-2 border-ink bg-lemon px-3 py-1 text-xs font-bold sm:inline-block">
              {user.email}
            </span>
            <Link to="/products/new" className="btn-pink !px-3 !py-2 text-xs sm:text-sm">
              + Yeni Ürün
            </Link>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="btn-white !px-3 !py-2 text-xs sm:text-sm"
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="btn-white !px-3 !py-2 text-xs sm:text-sm">
              Giriş Yap
            </Link>
            <Link to="/register" className="btn-pink !px-3 !py-2 text-xs sm:text-sm">
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
