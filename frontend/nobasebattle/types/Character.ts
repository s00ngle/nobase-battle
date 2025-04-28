import type { BadgeType } from './Badge'

export interface TCharacterResponse {
  textCharacterId: string
  name: string
  prompt: string
  wins: number
  losses: number
  draws: number
  totalBattles: number
  winRate: number
  eloScore: number
  rank: number
  badges: BadgeType[]
  createdAt?: string
  updatedAt?: string
}
