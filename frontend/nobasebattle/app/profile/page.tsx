'use client'

import Button from '@/components/common/Button'
import InputBox from '@/components/common/InputBox'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { transparentForm } from '@/styles/form'
import { authApi } from '@/utils/api/auth'
import { checkNickname, getProfile, updateNickname } from '@/utils/user'
import { useEffect, useState } from 'react'

const Profile = () => {
  const { signOut } = useAuth()
  const { role, setRole } = useAuthStore()
  const [profile, setProfile] = useState<{
    nickname: string
    email: string
    accountRole: string
  } | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [nickname, setNickname] = useState('')
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null)
  const [isCheckingNickname, setIsCheckingNickname] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLinking, setIsLinking] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile()
        setProfile(response.data)
        setNickname(response.data.nickname)
      } catch (error) {
        console.error('프로필 정보를 가져오는데 실패했습니다:', error)
      }
    }

    fetchProfile()
  }, [])

  const handleEditClick = () => {
    setIsEditing(true)
    setIsNicknameAvailable(null)
    setUpdateError(null)
  }

  const handleSaveClick = async () => {
    if (!isNicknameAvailable) {
      alert('닉네임 중복 확인을 해주세요.')
      return
    }

    try {
      const response = await updateNickname(nickname)
      if (response.success) {
        setProfile(response.data)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('닉네임 변경 중 오류 발생:', error)
      setUpdateError('닉네임 변경에 실패했습니다.')
    }
  }

  const handleCancelClick = () => {
    setNickname(profile?.nickname || '')
    setIsEditing(false)
    setIsNicknameAvailable(null)
    setUpdateError(null)
  }

  const handleCheckNickname = async () => {
    if (nickname === profile?.nickname) {
      setIsNicknameAvailable(true)
      return
    }

    setIsCheckingNickname(true)
    try {
      const response = await checkNickname(nickname)
      setIsNicknameAvailable(!response.data.exists)
    } catch (error) {
      console.error('닉네임 중복 확인 중 오류 발생:', error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('닉네임 중복 확인 중 오류가 발생했습니다.')
      }
    } finally {
      setIsCheckingNickname(false)
    }
  }

  const handleLinkAccount = async () => {
    if (!email || !password) {
      setLinkError('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    setIsLinking(true)
    setLinkError(null)

    try {
      const response = await authApi.linkAccount({ email, password })
      if (response.success) {
        // 계정 연동 성공 시 상태 업데이트
        setRole(response.data.accountRole)
        setProfile(response.data)
        // 페이지 새로고침
        window.location.reload()
      }
    } catch (error) {
      console.error('계정 연동 중 오류 발생:', error)
      setLinkError('계정 연동에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    } finally {
      setIsLinking(false)
    }
  }

  return (
    <div className={`w-full max-w-150 flex flex-col gap-6 p-6 rounded-2xl ${transparentForm}`}>
      <h1 className="text-2xl font-bold">프로필</h1>

      {/* 프로필 정보 섹션 */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl">내 정보</h2>
          {role === 'USER' && !isEditing && <Button text="수정" onClick={handleEditClick} />}
        </div>
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <InputBox
                    label="닉네임"
                    value={nickname}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 10) {
                        setNickname(value)
                        setIsNicknameAvailable(null)
                      }
                    }}
                    maxLength={10}
                  />
                  <span className="text-sm text-gray-500 text-right">{nickname.length}/10</span>
                </div>
                <Button
                  text={isCheckingNickname ? '확인중...' : '중복확인'}
                  onClick={handleCheckNickname}
                  disabled={isCheckingNickname || nickname === profile?.nickname}
                  className="h-[42px]"
                />
              </div>
              {isNicknameAvailable !== null && (
                <span
                  className={`text-sm ${isNicknameAvailable ? 'text-green-500' : 'text-red-500'}`}
                >
                  {isNicknameAvailable
                    ? '사용 가능한 닉네임입니다.'
                    : '이미 사용 중인 닉네임입니다.'}
                </span>
              )}
              {updateError && <span className="text-sm text-red-500">{updateError}</span>}
            </div>
            <div className="flex gap-2">
              <Button text="저장" onClick={handleSaveClick} disabled={!isNicknameAvailable} />
              <Button text="취소" onClick={handleCancelClick} />
            </div>
          </div>
        ) : (
          <>
            <span>닉네임 : {profile?.nickname}</span>
            {role === 'USER' && <span>이메일 : {profile?.email}</span>}
          </>
        )}
      </div>

      {/* 계정 관리 섹션 */}
      {role === 'GUEST' && (
        <div className={`flex flex-col gap-4 ${transparentForm} p-4 rounded-2xl`}>
          <h2 className="text-xl">계정 연동</h2>
          <InputBox label="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputBox
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {linkError && <span className="text-sm text-red-500">{linkError}</span>}
          <Button
            text={isLinking ? '연동중...' : '계정 연동'}
            onClick={handleLinkAccount}
            disabled={isLinking}
          />
        </div>
      )}
      <Button text="로그아웃" onClick={signOut} border={true} />
    </div>
  )
}

export default Profile
