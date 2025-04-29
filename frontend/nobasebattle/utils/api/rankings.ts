import type { CharacterRankingApiResponse } from '@/types/Ranking'
import { lux } from '../lux'

export const fetchDailyTextRankings = async () => {
  try {
    const response = await lux.get<CharacterRankingApiResponse>(
      '/api/v1/rankings/text/daily',
    )
    if (!response) throw new Error('일일 텍스트 랭킹 조회에 실패했습니다.')
    return response
  } catch (error) {
    console.error('API 호출 중 에러 발생:', error)
    throw error
  }
}

export const fetchInfTextRankings = async () => {
  try {
    const response = await lux.get<CharacterRankingApiResponse>(
      '/api/v1/rankings/text/inf',
    )
    if (!response) throw new Error('무기한 텍스트 랭킹 조회에 실패했습니다.')
    return response
  } catch (error) {
    console.error('API 호출 중 에러 발생:', error)
    throw error
  }
}
