// 캐릭터 전적 타입
export interface CharacterRecord {
  eloScore: number
  winRate: number
  totalBattles: number
  wins: number
  losses: number
  draws: number
}

// 텍스트 배틀에 등장하는 캐릭터 타입
export interface TBattleCharacter {
  characterId: string
  name: string
  prompt: string
  record: CharacterRecord
}

// 텍스트 배틀 전체 응답 타입
export interface TBattleResponse {
  battleId: string
  firstCharacter: TBattleCharacter
  secondCharacter: TBattleCharacter
  result: number
  battleLog: string
  createdAt: string
}

// 이미지 배틀에 등장하는 캐릭터 타입
export interface IBattleCharacter {
  characterId: string
  name: string
  prompt: string
  imageUrl: string
  record: CharacterRecord
}

// 이미지 배틀 전체 응답 타입
export interface IBattleResponse {
  battleId: string
  firstCharacter: IBattleCharacter
  secondCharacter: IBattleCharacter
  result: number
  battleLog: string
  createdAt: string
}

// API 응답 타입
export interface ApiResponse<T> {
  status: number
  data: T
  success: boolean
  timeStamp: string
}

// 배틀 요청 타입
export interface IFetchBattle {
  characterId: string
  mode: string
  opponentId?: string
}
