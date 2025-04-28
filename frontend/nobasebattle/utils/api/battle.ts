import type { TBattleApiResponse } from '@/types/Battle'
import { lux } from '../lux'

interface IFetchBattle {
  characterId: string
  mode: string
  opponentId?: string
}

export const fetchRandomTextBattle = async (characterId: string) => {
  const body: IFetchBattle = {
    characterId,
    mode: 'RANDOM',
  }

  const response = await lux.post<TBattleApiResponse>('/api/v1/battles/text', body)
  if (!response) throw new Error('텍스트 배틀 생성에 실패했습니다.')
  return response
}

export const fetchRandomImageBattle = async (characterId: string) => {
  const body: IFetchBattle = {
    characterId,
    mode: 'RANDOM',
  }

  const response = await lux.post<TBattleApiResponse>('/api/v1/battles/image', body)
  if (!response) throw new Error('이미지 배틀 생성에 실패했습니다.')
  return response
}

export const fetchChallengeTextBattle = async (characterId: string, opponentId: string) => {
  const body: IFetchBattle = {
    characterId,
    mode: 'CHALLENGE',
    opponentId,
  }

  const response = await lux.post<TBattleApiResponse>('/api/v1/battles/text', body)
  if (!response) throw new Error('랭킹에 도전하는 데 실패했습니다.')
  return response
}
