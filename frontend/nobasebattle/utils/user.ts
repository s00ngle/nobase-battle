import { lux } from './lux'

interface ProfileResponse {
  status: number
  data: {
    nickname: string
    email: string
    accountRole: string
  }
  success: boolean
  timeStamp: string
}

interface CheckNicknameResponse {
  status: number
  data: {
    exists: boolean
  }
  success: boolean
  timeStamp: string
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await lux.get<ProfileResponse>('/api/v1/users/profile')
  if (!response) throw new Error('프로필 정보를 가져오는데 실패했습니다.')
  return response
}

export const updateNickname = async (nickname: string): Promise<ProfileResponse> => {
  const response = await lux.patch<ProfileResponse>('/api/v1/users/profile', { nickname })
  if (!response) throw new Error('닉네임 변경에 실패했습니다.')
  return response
}

export const checkNickname = async (nickname: string): Promise<CheckNicknameResponse> => {
  const response = await lux.get<CheckNicknameResponse>(
    `/api/v1/users/check-nickname?nickname=${encodeURIComponent(nickname)}`,
  )
  if (!response) throw new Error('닉네임 중복 확인에 실패했습니다.')
  return response
}
