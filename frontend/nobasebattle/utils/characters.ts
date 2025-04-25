import type {
  ApiResponse,
  ImageCharacter,
  ImageCharacterListResponse,
  TextCharacter,
} from '@/app/types/character'
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

export const fetchTextCharacters = async (): Promise<TextCharacter[]> => {
  try {
    const response = await lux.get<ApiResponse<TextCharacter[]>>('/api/v1/characters/text')
    if (!response?.data) {
      throw new Error('텍스트 캐릭터 목록을 가져오는데 실패했습니다')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching text characters:', error)
    throw error
  }
}

export const fetchImageCharacters = async (): Promise<ImageCharacter[]> => {
  try {
    const response = await lux.get<ApiResponse<ImageCharacterListResponse>>(
      '/api/v1/characters/image',
    )
    if (!response?.data?.content) {
      throw new Error('이미지 캐릭터 목록을 가져오는데 실패했습니다')
    }
    return response.data.content
  } catch (error) {
    console.error('Error fetching image characters:', error)
    throw error
  }
}
