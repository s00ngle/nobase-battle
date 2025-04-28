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
    { text: '제 1회 토너먼트 우승자', imageUrl: '/favicon.png' },
    { text: '20연승 달성', imageUrl: '/favicon.png' },
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
        {badgeList.length > 0 && <BadgeList badges={badgeList} size={20} />}
      </div>
    </div>
  )
}

export default RankingItems
