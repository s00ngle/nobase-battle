import type { ApiResponse, ImageCharacter, TextCharacter } from '@/app/types/character'
import type { TCharacterResponse } from '@/types/Character'
import { lux } from './lux'

interface CreateTextCharacterRequest {
  name: string
  prompt: string
}

interface CreateImageCharacterRequest {
  name: string
  image: File | Blob
}

interface ApiError {
  response: {
    status: number
    reason: string
    path: string
    success: boolean
    timeStamp: string
  }
}

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
    const response = await lux.get<ApiResponse<ImageCharacter[]>>('/api/v1/characters/image')
    if (!response?.data) {
      throw new Error('이미지 캐릭터 목록을 가져오는데 실패했습니다')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching image characters:', error)
    throw error
  }
}

export const createTextCharacter = async (
  data: CreateTextCharacterRequest,
): Promise<TCharacterResponse> => {
  try {
    const response = await lux.post<ApiResponse<TCharacterResponse>>(
      '/api/v1/characters/text',
      data,
    )
    if (!response?.data) {
      throw new Error('텍스트 캐릭터 생성에 실패했습니다')
    }
    return response.data
  } catch (error) {
    if ((error as ApiError).response?.reason) {
      throw new Error((error as ApiError).response.reason)
    }
    console.error('텍스트 캐릭터 생성 중 에러 발생:', error)
    throw error
  }
}

export const createImageCharacter = async (
  data: CreateImageCharacterRequest,
): Promise<TCharacterResponse> => {
  try {
    const formData = new FormData()
    const jsonData = new Blob([JSON.stringify({ name: data.name })], {
      type: 'application/json',
    })
    formData.append('data', jsonData)

    if (data.image instanceof File) {
      formData.append('image', data.image, data.image.name)
    } else {
      formData.append('image', data.image, 'image.png')
    }

    const response = await lux.postForm<ApiResponse<TCharacterResponse>>(
      '/api/v1/characters/image',
      formData,
    )
    if (!response?.data) {
      throw new Error('이미지 캐릭터 생성에 실패했습니다')
    }
    return response.data
  } catch (error) {
    if ((error as ApiError).response?.reason) {
      throw new Error((error as ApiError).response.reason)
    }
    console.error('이미지 캐릭터 생성 중 에러 발생:', error)
    throw error
  }
}
