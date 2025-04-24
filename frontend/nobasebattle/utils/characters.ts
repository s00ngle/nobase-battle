import type { TCharacterResponse } from '@/types/Character'
import { lux } from './lux'

export const getCharacter = async (id: string): Promise<TCharacterResponse> => {
  try {
    const data = await lux.get<TCharacterResponse>(`/api/v1/characters/text/${id}`)
    if (!data) {
      throw new Error('캐릭터 정보를 가져오는데 실패했습니다')
    }
    return data
  } catch (error) {
    console.error('API 호출 중 에러 발생:', error)
    throw error
  }
}
