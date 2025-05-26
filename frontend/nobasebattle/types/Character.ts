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
  winStreak?: number | null
  loseStreak?: number | null
  badges: BadgeType[]
  createdAt?: string
  updatedAt?: string
}

export interface ICharacterResponse {
  imageCharacterId: string
  name: string
  imageUrl: string
  wins: number
  losses: number
  draws: number
  totalBattles: number
  winRate: number
  eloScore: number
  rank: number
  winStreak?: number | null
  loseStreak?: number | null
  badges: BadgeType[]
  createdAt: string
  updatedAt: string
}
