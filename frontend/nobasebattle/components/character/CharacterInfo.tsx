import { hover, transparentForm } from '@/styles/form'
import type { ICharacterResponse, TCharacterResponse } from '@/types/Character'
import type React from 'react'
import BadgeList from '../common/BadgeList'
import IconButton from '../common/IconButton'
import SkeletonLoading from '../common/SkeletonLoading'
import CharacterRecord from './CharacterRecord'
import CharacterStatusSummary from './CharacterStatusSummary'

interface InfoProps {
  data: TCharacterResponse | ICharacterResponse
  character: React.ReactNode
  isLoading?: boolean
}

const CharacterInfo = ({ character, data, isLoading = false }: InfoProps) => {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl p-4 ${transparentForm}`}>
      <div className="flex justify-between items-center h-10">
        <p className="text-xl">캐릭터 정보</p>
        {data.winStreak !== null && data.winStreak !== undefined && data.winStreak > 0 && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-base font-bold animate-pulse">
            👑{data.winStreak}
          </div>
        )}
        {data.loseStreak !== null && data.loseStreak !== undefined && data.loseStreak > 0 && (
          <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-base font-bold animate-pulse">
            💀{data.loseStreak}
          </div>
        )}
      </div>
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
        ) : data.badges && data.badges.length > 0 ? (
          <BadgeList badges={data.badges} />
        ) : (
          <div className={`text-center text-lg rounded-xl p-2 ${transparentForm}`}>
            획득뱃지가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default CharacterInfo
