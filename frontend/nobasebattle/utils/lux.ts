const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''

import { useAuthStore } from '@/store/authStore'

/**
 * API 요청을 위한 클라이언트
 *
 * 사용 예시:
 *
 * // GET 요청 (쿼리 파라미터 포함)
 * const characters = await lux.get<Character[]>('/api/characters', {
 *   page: '1',
 *   limit: '10'
 * })
 *
 * // POST 요청 (데이터 생성)
 * const newCharacter = await lux.post<Character>('/api/characters', {
 *   name: '캐릭터 이름',
 *   type: '캐릭터 타입'
 * })
 *
 * // PUT 요청 (데이터 수정)
 * const updatedCharacter = await lux.put<Character>('/api/characters/1', {
 *   name: '수정된 이름',
 *   type: '수정된 타입'
 * })
 *
 * // PATCH 요청 (부분 수정)
 * const updatedCharacter = await lux.patch<Character>('/api/characters/1', {
 *   name: '수정된 이름'
 * })
 *
 * // DELETE 요청 (데이터 삭제)
 * const result = await lux.delete<{ success: boolean }>('/api/characters/1')
 */

interface ErrorResponse {
  status: number
  reason: string
  path: string
  success: boolean
  timeStamp: string
}

const getUrl = (endpoint: string) => {
  if (BASE_URL) {
    return new URL(`${BASE_URL}${endpoint}`)
  }
  return endpoint
}

export const lux = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
    const url = getUrl(endpoint)
    if (params && url instanceof URL) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
      }
    }

    const accessToken = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      throw { response: errorData }
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async post<T>(endpoint: string, body: unknown): Promise<T | null> {
    const accessToken = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }

    const response = await fetch(getUrl(endpoint).toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      throw { response: errorData }
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async put<T>(endpoint: string, body: unknown): Promise<T | null> {
    const accessToken = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }

    const response = await fetch(getUrl(endpoint).toString(), {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      throw { response: errorData }
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async patch<T>(endpoint: string, body: unknown): Promise<T | null> {
    const accessToken = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }

    const response = await fetch(getUrl(endpoint).toString(), {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      throw { response: errorData }
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async delete<T>(endpoint: string): Promise<T | null> {
    const accessToken = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }

    const response = await fetch(getUrl(endpoint).toString(), {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      throw { response: errorData }
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async postForm<T>(endpoint: string, formData: FormData): Promise<T | null> {
    const accessToken = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    }

    const response = await fetch(getUrl(endpoint).toString(), {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse
      throw { response: errorData }
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  },
}
