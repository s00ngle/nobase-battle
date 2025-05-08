'use client'
import RankingItem from '@/components/ranking/RankingItem'
import { transparentForm } from '@/styles/form'
import type { CharacterRankingApiResponse } from '@/types/Ranking'
import { useRouter } from 'next/navigation'

interface IRankingList {
  rankingData: CharacterRankingApiResponse
  rankingType: 'text' | 'image'
}

const RankingList = ({ rankingData, rankingType }: IRankingList) => {
  const router = useRouter()
  const data = rankingData?.data

  const handleRankerClick = (characterId: string, name: string, imageUrl = '') => {
    const encodedName = encodeURIComponent(name)
    const encodedImageUrl = encodeURIComponent(imageUrl || '')
    router.push(
      `/practice?opponentId=${characterId}&type=${rankingType}&name=${encodedName}&imageUrl=${encodedImageUrl}`,
    )
  }

  return (
    <div className={`flex flex-col gap-3 p-4 rounded-2xl ${transparentForm} w-full max-w-150`}>
      {data.map((item) => {
        return (
          <div
            key={item.characterId}
            onClick={() => handleRankerClick(item.characterId, item.name, item.imageUrl)}
            className="cursor-pointer"
          >
            <RankingItem
              rank={item.rank}
              characterName={item.name}
              username={item.username}
              eloScore={item.eloScore}
              badgeList={item.badges}
            />
          </div>
        )
      })}
    </div>
  )
}

export default RankingList
