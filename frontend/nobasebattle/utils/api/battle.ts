import type { TBattleResponse } from '@/types/Battle'
import { lux } from '../lux'

export const fetchTextBattle = async (characterId: string) => {
  const response = await lux.post<TBattleResponse>('/api/v1/battles/text', { characterId })
  if (!response) throw new Error('텍스트 배틀 생성에 실패했습니다.')
  return response
}
