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
}
