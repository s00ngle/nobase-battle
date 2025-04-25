import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/utils/api/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useAuth = () => {
  const router = useRouter()
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuthSuccess = (response: { data: { accessToken: string; role: string } }) => {
    setAuth(response.data.accessToken, response.data.role)
    router.push('/')
  }

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.signUp({ email, password })
      handleAuthSuccess(response)
    } catch (err) {
      setError('회원가입에 실패했습니다.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const anonymousSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.anonymousSignIn()
      handleAuthSuccess(response)
    } catch (err) {
      setError('빠른 시작에 실패했습니다.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    clearAuth()
    router.push('/')
  }

  return {
    signUp,
    anonymousSignIn,
    signOut,
    isLoading,
    error,
    isAuthenticated,
  }
}
