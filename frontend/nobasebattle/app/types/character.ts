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
  characterId: string
  name: string
  imageUrl: string
  wins: number
  losses: number
  draws: number
  totalBattles: number
  winRate: number
  eloScore: number
  rank: number
  badges: string[]
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  status: number
  data: T
  success: boolean
  timeStamp: string
}

export interface ImageCharacterListResponse {
  content: ImageCharacter[]
}
