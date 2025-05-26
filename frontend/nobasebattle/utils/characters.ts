import type { ApiResponse, ImageCharacter, TextCharacter } from '@/app/types/character'
import type { ICharacterResponse, TCharacterResponse } from '@/types/Character'
import { lux } from './lux'

interface CreateTextCharacterRequest {
  name: string
  prompt: string
}

interface CreateImageCharacterRequest {
  name: string
  image: File | Blob
}

interface UpdateTextCharacterRequest {
  name: string
  prompt: string
}

interface UpdateImageCharacterRequest {
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

export const getTextCharacter = async (id: string): Promise<TCharacterResponse> => {
  try {
    const response = await lux.get<ApiResponse<TCharacterResponse>>(`/api/v1/characters/text/${id}`)
    if (!response?.data) {
      throw new Error('캐릭터 정보를 가져오는데 실패했습니다')
    }
    return response.data
  } catch (error) {
    console.error('API 호출 중 에러 발생:', error)
    throw error
  }
}

export const getImageCharacter = async (id: string): Promise<ICharacterResponse> => {
  try {
    const response = await lux.get<ApiResponse<ICharacterResponse>>(
      `/api/v1/characters/image/${id}`,
    )
    if (!response?.data) {
      throw new Error('캐릭터 정보를 가져오는데 실패했습니다')
    }
    return response.data
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

export const deleteTextCharacter = async (id: string): Promise<void> => {
  try {
    await lux.delete(`/api/v1/characters/text/${id}`)
  } catch (error) {
    console.error('텍스트 캐릭터 삭제 중 에러 발생:', error)
    throw error
  }
}

export const deleteImageCharacter = async (id: string): Promise<void> => {
  try {
    await lux.delete(`/api/v1/characters/image/${id}`)
  } catch (error) {
    console.error('이미지 캐릭터 삭제 중 에러 발생:', error)
    throw error
  }
}

export const updateTextCharacter = async (
  id: string,
  data: UpdateTextCharacterRequest,
): Promise<TCharacterResponse> => {
  try {
    const response = await lux.patch<ApiResponse<TCharacterResponse>>(
      `/api/v1/characters/text/${id}`,
      data,
    )
    if (!response?.data) {
      throw new Error('텍스트 캐릭터 수정에 실패했습니다')
    }
    return response.data
  } catch (error) {
    if ((error as ApiError).response?.reason) {
      throw new Error((error as ApiError).response.reason)
    }
    console.error('텍스트 캐릭터 수정 중 에러 발생:', error)
    throw error
  }
}

export const updateImageCharacter = async (
  id: string,
  data: UpdateImageCharacterRequest,
): Promise<ICharacterResponse> => {
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

    const response = await lux.patchForm<ApiResponse<ICharacterResponse>>(
      `/api/v1/characters/image/${id}`,
      formData,
    )
    if (!response?.data) {
      throw new Error('이미지 캐릭터 수정에 실패했습니다')
    }
    return response.data
  } catch (error) {
    if ((error as ApiError).response?.reason) {
      throw new Error((error as ApiError).response.reason)
    }
    console.error('이미지 캐릭터 수정 중 에러 발생:', error)
    throw error
  }
}
