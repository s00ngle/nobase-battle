import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/utils/api/auth'
import { deleteCookie, setCookie } from '@/utils/cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useAuth = () => {
  const router = useRouter()
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuthSuccess = async (response: { data: { accessToken: string; role: string } }) => {
    const { accessToken, role } = response.data
    setAuth(accessToken, role)
    await setCookie('token', accessToken, {
      path: '/',
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7일
    })
    router.push('/')
  }

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await authApi.signUp({ email, password })
      await handleAuthSuccess(response)
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
      await handleAuthSuccess(response)
    } catch (err) {
      setError('빠른 시작에 실패했습니다.')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      clearAuth()
      await deleteCookie('token')
      // 쿠키가 완전히 삭제되었는지 확인
      const checkCookieDeleted = () => {
        const cookies = document.cookie.split(';')
        return !cookies.some(cookie => cookie.trim().startsWith('token='))
      }
      
      // 쿠키가 완전히 삭제될 때까지 대기
      let retries = 0
      const maxRetries = 5
      const waitForCookieDeletion = () => {
        if (checkCookieDeleted() || retries >= maxRetries) {
          router.push('/register')
        } else {
          retries++
          setTimeout(waitForCookieDeletion, 100)
        }
      }
      
      waitForCookieDeletion()
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
    }
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
