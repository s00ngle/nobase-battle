'use client'
import RankingList from '@/components/ranking/RankingList'
import { hover, transparentForm } from '@/styles/form'
import type { CharacterRankingApiResponse } from '@/types/Ranking'
import {
  fetchDailyImageRankings,
  fetchDailyTextRankings,
  fetchInfImageRankings,
  fetchInfTextRankings,
} from '@/utils/api/rankings'
import { useCallback, useEffect, useState } from 'react'

type RankingType = 'text' | 'image'

const RankPage = () => {
  const [textailyRanking, setTextailyRanking] = useState<CharacterRankingApiResponse | null>(null)
  const [rankType, setRankType] = useState<'daily' | 'infinite'>('daily')
  const [rankingType, setRankingType] = useState<RankingType>('text')

  const fetchRankings = useCallback(
    async (type: 'daily' | 'infinite', rankingType: RankingType) => {
      try {
        let response: CharacterRankingApiResponse | null = null
        if (rankingType === 'text') {
          response =
            type === 'daily' ? await fetchDailyTextRankings() : await fetchInfTextRankings()
        } else {
          response =
            type === 'daily' ? await fetchDailyImageRankings() : await fetchInfImageRankings()
        }

        if (response?.data) {
          setTextailyRanking(response)
        }
      } catch (error) {
        console.error('랭킹 데이터를 불러오는데 실패했습니다:', error)
      }
    },
    [],
  )

  useEffect(() => {
    fetchRankings(rankType, rankingType)
  }, [rankType, rankingType, fetchRankings])

  return (
    <div className="text-2xl w-full flex flex-col items-center gap-4">
      랭커에게 도전해보세요!
      <div className="w-full max-w-150">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl whitespace-nowrap">랭킹</span>
          <div className="flex gap-2">
            <div className="flex rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setRankingType('text')}
                className={`px-3 py-1 text-base cursor-pointer
                  ${rankingType === 'text' ? 'bg-gray-500/20 dark:bg-white/20' : transparentForm}
                  ${hover}
                  whitespace-nowrap
                  `}
              >
                텍스트
              </button>
              <button
                type="button"
                onClick={() => setRankingType('image')}
                className={`px-3 py-1 text-base cursor-pointer
                  ${rankingType === 'image' ? 'bg-gray-500/20 dark:bg-white/20' : transparentForm}
                  ${hover}
                  whitespace-nowrap
                  `}
              >
                그림
              </button>
            </div>
            <div className="flex rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setRankType('daily')}
                className={`px-3 py-1 text-base cursor-pointer
                  ${rankType === 'daily' ? 'bg-gray-500/20 dark:bg-white/20' : transparentForm}
                  ${hover}
                  whitespace-nowrap
                  `}
              >
                일간
              </button>
              <button
                type="button"
                onClick={() => setRankType('infinite')}
                className={`px-3 py-1 text-base cursor-pointer
                  ${rankType === 'infinite' ? 'bg-gray-500/20 dark:bg-white/20' : transparentForm}
                  ${hover}
                  whitespace-nowrap
                  `}
              >
                무기한
              </button>
            </div>
          </div>
        </div>
        {textailyRanking && <RankingList rankingData={textailyRanking} rankingType={rankingType} />}
      </div>
    </div>
  )
}

export default RankPage
