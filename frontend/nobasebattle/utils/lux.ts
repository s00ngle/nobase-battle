const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

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
 * // DELETE 요청 (데이터 삭제)
 * const result = await lux.delete<{ success: boolean }>('/api/characters/1')
 */
export const lux = {
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
    const url = new URL(`${BASE_URL}${endpoint}`)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value)
      }
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async post<T>(endpoint: string, body: unknown): Promise<T | null> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async put<T>(endpoint: string, body: unknown): Promise<T | null> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },

  async delete<T>(endpoint: string): Promise<T | null> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 204 No Content 응답 처리
    if (response.status === 204) {
      return null
    }

    return response.json()
  },
}
