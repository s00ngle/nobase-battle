import { transparentForm } from '@/styles/form'
import type { BadgeType } from '@/types/Badge'
import type { TCharacterResponse } from '@/types/Character'
import BadgeList from '../common/BadgeList'
import CharacterRecord from './CharacterRecord'
import CharacterStatusSummary from './CharacterStatusSummary'

interface InfoProps {
  data: TCharacterResponse
  character: React.ReactNode
}

const badgeList: BadgeType[] = [
  { text: '제1회 토너먼트 우승자', bgColor: 'accent' },
  { text: '무근본상1', bgColor: 'red' },
  { text: '무근본상2', bgColor: 'yellow' },
  { text: '제2회 토너먼트 우승자', bgColor: 'green' },
]

const CharacterInfo = ({ character, data }: InfoProps) => {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl p-4 ${transparentForm}`}>
      <p className="text-xl">캐릭터 정보</p>
      <p className="text-xl">전적</p>
      <CharacterRecord
        totalBattles={data.totalBattles}
        wins={data.wins}
        losses={data.losses}
        draws={data.draws}
      />
      {character}
      <CharacterStatusSummary eloScore={data.eloScore} winRate={data.winRate} rank={data.rank} />
      <div className="flex flex-col gap-2">
        <p className="text-xl">획득뱃지</p>
        <BadgeList badges={badgeList} />
      </div>
    </div>
  )
}

export default CharacterInfo
