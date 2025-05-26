import BadgeList from '@/components/common/BadgeList'
import { hover, transparentForm } from '@/styles/form'
import type { BadgeType } from '@/types/Badge'

interface RankingItemsProps {
  rank: number
  characterName: string
  username?: string
  eloScore: number
  badgeList?: BadgeType[]
}

const RankingItems = ({
  rank,
  characterName,
  username,
  eloScore,
  badgeList = [],
}: RankingItemsProps) => {
  return (
    <div className={`flex justify-between gap-2 px-4 py-4 rounded-xl ${transparentForm} ${hover}`}>
      <div className="flex gap-4 items-center min-w-0">
        <span className="text-3xl w-9 text-center flex-shrink-0">{rank}</span>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xl truncate whitespace-nowrap">{characterName}</span>
          <span className="text-sm truncate whitespace-nowrap">{username}</span>
        </div>
      </div>
      {/* 점수와 뱃지 목록 */}
      <div className="flex flex-col justify-center items-end gap-1 flex-shrink-0">
        <span className="text-xl whitespace-nowrap">{eloScore}점</span>
        {badgeList && badgeList.length > 0 && (
          <BadgeList
            badges={badgeList}
            size={25}
            isTransparent={false}
            isPadding={false}
            isRightAligned={true}
          />
        )}
      </div>
    </div>
  )
}

export default RankingItems
