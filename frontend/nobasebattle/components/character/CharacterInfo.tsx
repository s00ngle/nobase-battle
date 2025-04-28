import { hover, transparentForm } from '@/styles/form'
import type { BadgeType } from '@/types/Badge'
import type { TCharacterResponse } from '@/types/Character'
import type React from 'react'
import BadgeList from '../common/BadgeList'
import IconButton from '../common/IconButton'
import SkeletonLoading from '../common/SkeletonLoading'
import CharacterRecord from './CharacterRecord'
import CharacterStatusSummary from './CharacterStatusSummary'

interface InfoProps {
  data: TCharacterResponse
  character: React.ReactNode
  isLoading?: boolean
}

const badgeList: BadgeType[] = [
  { text: '제1회 토너먼트 우승자', imageUrl: '/favicon.png' },
  { text: '무근본상1', imageUrl: '/favicon.png' },
  { text: '무근본상2', imageUrl: '/favicon.png' },
  { text: '제2회 토너먼트 우승자', imageUrl: '/favicon.png' },
]

const CharacterInfo = ({ character, data, isLoading = false }: InfoProps) => {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl p-4 ${transparentForm}`}>
      <p className="text-xl">캐릭터 정보</p>
      <p className="text-xl">전적</p>
      <CharacterRecord
        totalBattles={data.totalBattles}
        wins={data.wins}
        losses={data.losses}
        draws={data.draws}
        isLoading={isLoading}
      />
      {isLoading ? (
        <div
          className={`flex flex-col gap-3 w-full p-3 rounded-2xl cursor-pointer ${transparentForm} ${hover}`}
        >
          <div className="flex justify-between">
            <SkeletonLoading width="8rem" height="1.5rem" className="rounded-lg" />
            <div className="flex gap-2">
              <IconButton icon="pen.svg" />
              <IconButton icon="delete.svg" />
            </div>
          </div>
          <SkeletonLoading width="12rem" height="1.5rem" className="rounded-lg" />
        </div>
      ) : (
        character
      )}
      <CharacterStatusSummary
        eloScore={data.eloScore}
        winRate={data.winRate}
        rank={data.rank}
        isLoading={isLoading}
      />
      <div className="flex flex-col gap-2">
        <p className="text-xl">획득뱃지</p>
        {isLoading ? (
          <SkeletonLoading width="100%" height="2rem" className="rounded-xl" />
        ) : (
          <BadgeList badges={badgeList} />
        )}
      </div>
    </div>
  )
}

export default CharacterInfo
