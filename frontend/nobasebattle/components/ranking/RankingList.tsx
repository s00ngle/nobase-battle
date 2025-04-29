import { transparentForm } from "@/styles/form";
import type { CharacterRankingApiResponse } from "@/types/Ranking";
import RankingItems from "./RankingItem";
interface IRankingList {
  rankingData: CharacterRankingApiResponse;
}

const RankingList = ({ rankingData }: IRankingList) => {
  const data = rankingData?.data;
  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-2xl ${transparentForm} w-full max-w-150`}
    >
      {data.map((item) => {
        return (
          <RankingItems
            key={item.characterId}
            rank={item.rank}
            characterName={item.name}
            eloScore={item.eloScore}
            badgeList={item.badges}
          />
        );
      })}
    </div>
  );
};

export default RankingList;
