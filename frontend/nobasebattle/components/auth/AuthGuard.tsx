'use client'

import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { create } from 'zustand'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

// persist 로딩 상태를 추적하는 store
const useHydrationStore = create(() => ({
  isHydrated: false,
}))

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const isHydrated = useHydrationStore((state) => state.isHydrated)

  useEffect(() => {
    useHydrationStore.setState({ isHydrated: true })
  }, [])

  useEffect(() => {
    if (isHydrated) {
      if (requireAuth && !isAuthenticated) {
        router.push('/register')
      } else if (!requireAuth && isAuthenticated) {
        router.push('/')
      }
    }
  }, [isAuthenticated, requireAuth, router, isHydrated])

  if (!isHydrated || (requireAuth && !isAuthenticated)) {
    return null
  }

  return <>{children}</>
}
