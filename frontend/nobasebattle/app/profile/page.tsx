'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import Button from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { transparentForm } from '@/styles/form'

const Profile = () => {
  const { signOut } = useAuth()
  const { isAuthenticated } = useAuthStore()

  return (
    <AuthGuard requireAuth={true}>
      <div className={`w-full max-w-150 flex flex-col gap-6 p-6 rounded-2xl ${transparentForm}`}>
        <h1 className="text-2xl font-bold">프로필</h1>

        {/* 프로필 정보 섹션 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl">내 정보</h2>
          {/* 여기에 프로필 정보를 추가할 수 있습니다 */}
        </div>

        {/* 계정 관리 섹션 */}
        {isAuthenticated && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl">계정 관리</h2>
            <Button text="로그아웃" onClick={signOut} border={true} />
          </div>
        )}
      </div>
    </AuthGuard>
  )
}

export default Profile
