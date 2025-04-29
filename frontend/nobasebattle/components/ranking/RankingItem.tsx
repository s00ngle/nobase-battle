import BadgeList from "@/components/common/BadgeList";
import { hover, transparentForm } from "@/styles/form";
import type { BadgeType } from "@/types/Badge";

interface RankingItemsProps {
  rank: number;
  characterName: string;
  username?: string;
  eloScore: number;
  badgeList?: BadgeType[];
}

const RankingItems = ({
  rank,
  characterName,
  username,
  eloScore,
  badgeList = [],
}: RankingItemsProps) => {
  return (
    <div
      className={`flex justify-between px-4 py-4 rounded-xl ${transparentForm} ${hover}`}
    >
      <div className="flex gap-7 items-center">
        <span className="text-3xl">{rank}</span>
        <div className="flex flex-col gap-1">
          <span className="text-xl max-sm:truncate max-sm:max-w-30">
            {characterName}
          </span>
          <span className="text-sm">{username}</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-end gap-1">
        <span className="text-xl whitespace-nowrap">{eloScore}점</span>
        {badgeList && badgeList.length > 0 && (
          <BadgeList
            badges={badgeList}
            size={25}
            isTransparent={false}
            isPadding={false}
          />
        )}
      </div>
    </div>
  );
};

export default RankingItems;
