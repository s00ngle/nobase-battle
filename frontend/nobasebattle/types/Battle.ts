// 캐릭터 전적 타입
export interface TCharacterRecord {
    eloScore: number;
    winRate: number;
    totalBattles: number;
    wins: number;
    losses: number;
    draws: number;
  }
  
  // 배틀에 등장하는 캐릭터 타입
  export interface TBattleCharacter {
    characterId: string;
    name: string;
    prompt: string;
    record: TCharacterRecord;
  }
  
  // 배틀 전체 응답 타입
  export interface TBattleResponse {
    battleId: string;
    firstCharacter: TBattleCharacter;
    secondCharacter: TBattleCharacter;
    result: number;
    battleLog: string;
    createdAt: string;
  }
  
  export interface TBattleApiResponse {
    success: boolean;
    timeStamp: string;
    data: TBattleResponse;
  }
  