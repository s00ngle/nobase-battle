import { lux } from '../lux'

interface SignUpRequest {
  email: string
  password: string
}

interface AuthResponse {
  success: boolean
  data: {
    accessToken: string
    role: string
  }
}

interface SignUpResponse {
  status: number
  data: {
    email: string
    nickname: string
    accountRole: string
  }
  success: boolean
  timeStamp: string
}

export const authApi = {
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await lux.post<AuthResponse>('/api/v1/users/signup', data)
    if (!response) throw new Error('회원가입에 실패했습니다.')
    return response
  },

  anonymousSignIn: async (): Promise<AuthResponse> => {
    const response = await lux.post<AuthResponse>('/api/v1/users/anonymous', {})
    if (!response) throw new Error('빠른 시작에 실패했습니다.')
    return response
  },

  linkAccount: async (data: SignUpRequest): Promise<SignUpResponse> => {
    const response = await lux.patch<SignUpResponse>('/api/v1/users/anonymous/signup', data)
    if (!response) throw new Error('계정 연동에 실패했습니다.')
    return response
  },
}
