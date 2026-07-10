import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from './Loader'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <PageLoader label="Oturum kontrol ediliyor" />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
