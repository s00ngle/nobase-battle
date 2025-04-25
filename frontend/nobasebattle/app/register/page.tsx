'use client'

import { ErrorBoundary } from '@/app/components/common/ErrorBoundary'
import { AuthGuard } from '@/components/auth/AuthGuard'
import Button from '@/components/common/Button'
import InputBox from '@/components/common/InputBox'
import { useAuth } from '@/hooks/useAuth'
import { hover, transparentForm } from '@/styles/form'
import { Suspense, useCallback, useMemo, useState } from 'react'

// 로딩 상태 컴포넌트 분리
const LoadingFallback = () => (
  <div
    className={`flex flex-col gap-6 w-full max-w-150 p-4 rounded-2xl ${transparentForm} ${hover}`}
  >
    <div className="animate-pulse bg-gray-200 h-10 rounded-lg" />
    <div className="space-y-4">
      <div className="animate-pulse bg-gray-200 h-10 rounded-lg" />
      <div className="animate-pulse bg-gray-200 h-10 rounded-lg" />
      <div className="animate-pulse bg-gray-200 h-10 rounded-lg" />
    </div>
  </div>
)

interface RegisterFormProps {
  isLoading: boolean
  error: string | null
  onSubmit: (email: string, password: string) => Promise<void>
  onAnonymousSignIn: () => Promise<void>
}

// 폼 컴포넌트 분리
const RegisterForm = ({ isLoading, error, onSubmit, onAnonymousSignIn }: RegisterFormProps) => {
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleInputChange = useCallback(
    (field: 'email' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    },
    [],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const { email, password } = formData

      if (email.length === 0 || password.length === 0) {
        alert('이메일 및 비밀번호를 입력해주세요')
        return
      }

      await onSubmit(email, password)
    },
    [formData, onSubmit],
  )

  const formContent = useMemo(
    () => (
      <>
        <Button text="빠른 시작" onClick={onAnonymousSignIn} disabled={isLoading} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <InputBox label="이메일" value={formData.email} onChange={handleInputChange('email')} />
          <InputBox
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            text={isLoading ? '처리 중...' : '등록 및 시작'}
            border={true}
            type="submit"
            disabled={isLoading}
          />
        </form>
      </>
    ),
    [formData, handleInputChange, handleSubmit, isLoading, error, onAnonymousSignIn],
  )

  return (
    <div
      className={`flex flex-col gap-6 w-full max-w-150 p-4 rounded-2xl ${transparentForm} ${hover}`}
    >
      {formContent}
    </div>
  )
}

const Register = () => {
  const { signUp, anonymousSignIn, isLoading, error } = useAuth()

  const handleSubmit = useCallback(
    async (email: string, password: string) => {
      await signUp(email, password)
    },
    [signUp],
  )

  const handleAnonymousSignIn = useCallback(async () => {
    await anonymousSignIn()
  }, [anonymousSignIn])

  return (
    <AuthGuard requireAuth={false}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <RegisterForm
            isLoading={isLoading}
            error={error}
            onSubmit={handleSubmit}
            onAnonymousSignIn={handleAnonymousSignIn}
          />
        </Suspense>
      </ErrorBoundary>
    </AuthGuard>
  )
}

export default Register
