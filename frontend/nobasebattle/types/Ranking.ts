import type { BadgeType } from './Badge'

export interface Character {
  characterId: string
  name: string
  username: string
  imgUrl?: string
  imageUrl?: string
  prompt: string
  rank: number
  wins: number
  losses: number
  draws: number
  eloScore: number
  createdAt: string
  updatedAt: string
  badges: BadgeType[]
}

export interface CharacterRankingApiResponse {
  status: number
  data: Character[]
  success: boolean
  timeStamp: string
}
