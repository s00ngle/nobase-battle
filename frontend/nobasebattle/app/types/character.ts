import type { BadgeType } from '@/types/Badge'

export interface TextCharacter {
  name: string
  prompt: string
  wins: number
  losses: number
  draws: number
  eloScore: number
  createAt: string
  updateAt: string
  winRate: number
  textCharacterId: string
}

export interface ImageCharacter {
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
  badges: BadgeType[]
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  status: number
  data: T
  success: boolean
  timeStamp: string
}
