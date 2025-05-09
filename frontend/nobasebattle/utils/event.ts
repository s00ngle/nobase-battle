import type { IEventResponse } from '@/app/types/Event'
import type { ApiResponse } from '@/app/types/character'
import type { IBattleResponse } from '@/types/Battle'
import type { ICharacterResponse } from '@/types/Character'
import { lux } from './lux'

interface IBadge {
  text: string
  imageUrl: string
  badgeType: string
  condition: unknown
}

interface IRankingData {
  rank: number
  characterId: string
  name: string
  username: string
  prompt: string
  wins: number
  losses: number
  draws: number
  eloScore: number
  createdAt: string
  updatedAt: string
  badges: IBadge[]
}

export interface IRankingResponse {
  status: number
  data: IRankingData[]
  success: boolean
  timeStamp: string
}

export const getEventCharacter = async (id: string): Promise<ICharacterResponse> => {
  try {
    const response = await lux.get<ApiResponse<ICharacterResponse>>(
      `/api/v1/characters/image/event/${id}`,
    )
    if (!response?.data) {
      throw new Error('이벤트 캐릭터 정보를 가져오는데 실패했습니다')
    }
    return response.data
  } catch (error) {
    console.error('Error fetching event character:', error)
    throw error
  }
}

export const startEventBattle = async (characterId: string): Promise<IBattleResponse> => {
  try {
    const response = await lux.post<ApiResponse<IBattleResponse>>('/api/v1/battles/event', {
      characterId,
      mode: 'EVENT',
    })
    if (!response?.data) {
      throw new Error('이벤트 배틀을 시작하는데 실패했습니다')
    }
    return response.data
  } catch (error) {
    console.error('Error starting event battle:', error)
    throw error
  }
}

export const getLatestEvent = async (): Promise<IEventResponse> => {
  try {
    const response = await lux.get<IEventResponse>('/api/v1/events/latest')
    if (!response?.data) {
      throw new Error('이벤트 정보를 가져오는데 실패했습니다')
    }
    return response
  } catch (error) {
    console.error('Error fetching latest event:', error)
    throw error
  }
}

export const getEventRanking = async (): Promise<IRankingResponse> => {
  try {
    const response = await lux.get<IRankingResponse>('/api/v1/rankings/event')
    if (!response?.data) {
      throw new Error('이벤트 랭킹 정보를 가져오는데 실패했습니다')
    }
    return response
  } catch (error) {
    console.error('Error fetching event ranking:', error)
    throw error
  }
}
