import { hover, transparentForm } from "@/styles/form";

interface RankingItemsProps {
  rank: number;
  characterName: string;
  username?: string;
  eloScore: number;
}

const RankingItems = ({
  rank,
  characterName,
  username,
  eloScore,
}: RankingItemsProps) => {
  return (
    <div
      className={`flex justify-between px-4 py-4 rounded-xl ${transparentForm} ${hover}`}
    >
      <div className="flex gap-7 items-center">
        <span className="text-3xl">{rank}</span>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xl">{characterName}</span>
          <span className="text-sm">({username})</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-end gap-1">
        <span className="text-xl">{eloScore}점</span>
      </div>
    </div>
  );
};

export default RankingItems;
