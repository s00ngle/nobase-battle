import type { TBattleApiResponse } from "@/types/Battle";

export const battleData: TBattleApiResponse = {
  success: true,
  timeStamp: "2025-04-21T16:35:24.86861",
  data: {
    battleId: "64a5d2e7b98c3a1f5e982d5b",
    firstCharacter: {
      characterId: "64a5d2e7b98c3a1f5e982c4b",
      name: "불꽃의 마법사",
      prompt: "불꽃을 잘 다룸",
      record: {
        eloScore: 1170,
        winRate: 50.0,
        totalBattles: 8,
        wins: 6,
        losses: 2,
        draws: 1,
      },
    },
    secondCharacter: {
      characterId: "64a5d2e7b98c3a1f5e982c4c",
      name: "어둠의 암살자",
      prompt: "어둠을 잘 다룸",
      record: {
        eloScore: 980,
        winRate: 50.0,
        totalBattles: 7,
        wins: 3,
        losses: 4,
        draws: 0,
      },
    },
    result: 1,
    battleLog:
      "불꽃의 마법사와 어둠의 암살자의 치열한 대결이 시작되었다! 불꽃의 마법사는 화염 폭풍을 소환하여 전장을 뜨겁게 달구었다. 어둠의 암살자는 그림자에 몸을 숨겨 기습을 시도했지만, 불꽃의 마법사의 화염 방벽에 막혔다. 불꽃의 마법사는 불사조를 소환해 강력한 일격을 가했고, 어둠의 암살자는 더 이상 저항할 수 없었다. 결국 불꽃의 마법사가 승리했다!",
    createdAt: "2025-04-21T16:35:24Z",
  },
};
