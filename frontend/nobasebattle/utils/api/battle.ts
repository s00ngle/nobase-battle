import type { ApiResponse, IBattleResponse, IFetchBattle, TBattleResponse } from '@/types/Battle'
import { lux } from '../lux'

export const fetchRandomTextBattle = async (characterId: string) => {
  const body: IFetchBattle = {
    characterId,
    mode: 'RANDOM',
  }

  const response = await lux.post<ApiResponse<TBattleResponse>>('/api/v1/battles/text', body)
  if (!response) throw new Error('텍스트 배틀 생성에 실패했습니다.')
  return response
}

export const fetchRandomImageBattle = async (characterId: string) => {
  const body: IFetchBattle = {
    characterId,
    mode: 'RANDOM',
  }

  const response = await lux.post<ApiResponse<IBattleResponse>>('/api/v1/battles/image', body)
  if (!response) throw new Error('이미지 배틀 생성에 실패했습니다.')
  return response
}

export const fetchChallengeTextBattle = async (characterId: string, opponentId: string) => {
  const body: IFetchBattle = {
    characterId,
    mode: 'CHALLENGE',
    opponentId,
  }

  const response = await lux.post<ApiResponse<TBattleResponse>>('/api/v1/battles/text', body)
  if (!response) throw new Error('랭킹에 도전하는 데 실패했습니다.')
  return response
}

export const fetchChallengeImageBattle = async (characterId: string, opponentId: string) => {
  const body: IFetchBattle = {
    characterId,
    mode: 'CHALLENGE',
    opponentId,
  }

  const response = await lux.post<ApiResponse<IBattleResponse>>('/api/v1/battles/image', body)
  if (!response) throw new Error('이미지 배틀 생성에 실패했습니다.')
  return response
}

export const startTextPracticeBattle = async (characterId: string, opponentId: string) => {
  const response = await lux.post<ApiResponse<TBattleResponse>>('/api/v1/battles/text/practice', {
    characterId,
    opponentId,
  })
  if (!response) throw new Error('배틀 시작에 실패했습니다.')
  return response
}

export const startImagePracticeBattle = async (characterId: string, opponentId: string) => {
  const response = await lux.post<ApiResponse<IBattleResponse>>('/api/v1/battles/image/practice', {
    characterId,
    opponentId,
  })
  if (!response) throw new Error('배틀 시작에 실패했습니다.')
  return response
}
