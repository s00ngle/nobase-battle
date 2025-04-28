import { hover, transparentForm } from '@/styles/form'
import type { BadgeType } from '@/types/Badge'
import BadgeList from '../common/BadgeList'

interface RankingItemsProps {
  rank: number
  characterName: string
  username?: string
  eloScore: number
}

const RankingItems = ({ rank, characterName, username, eloScore }: RankingItemsProps) => {
  const badgeList: BadgeType[] = [
    { text: '30연승 달성', imageUrl: '/badge-30-icon.png' },
    { text: '50연승 달성', imageUrl: '/badge-50-icon.png' },
  ]
  return (
    <div className={`flex justify-between px-4 py-4 rounded-xl ${transparentForm} ${hover}`}>
      <div className="flex gap-7 items-center">
        <span className="text-3xl">{rank}</span>
        <div className="flex flex-col gap-1 items-center">
          <span className="text-xl">{characterName}</span>
          <span className="text-sm">({username})</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-end gap-1">
        <span className="text-xl">{eloScore}점</span>
        {badgeList.length > 0 && <BadgeList badges={badgeList} size={25} isTransparent={false} />}
      </div>
    </div>
  )
}

export default RankingItems
