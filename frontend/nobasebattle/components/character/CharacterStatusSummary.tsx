import { transparentForm } from '@/styles/form'
import SkeletonLoading from '../common/SkeletonLoading'

interface SummaryProps {
  eloScore: number
  rank: number
  winRate: number
  isLoading?: boolean
}

// 공통 상태 표시 컴포넌트
const StatusItem = ({
  label,
  value,
  isLoading,
}: { label: string; value: string | number; isLoading: boolean }) => {
  return (
    <div className="flex flex-col items-center gap-2 text-base w-full">
      <span>{label}</span>
      {isLoading ? (
        <SkeletonLoading width="100%" height="3rem" className="rounded-xl" />
      ) : (
        <span
          className={`text-center w-full px-3 py-3 rounded-xl whitespace-nowrap ${transparentForm}`}
        >
          {value}
        </span>
      )}
    </div>
  )
}

const CharacterStatusSummary = ({ eloScore, rank, winRate, isLoading = false }: SummaryProps) => {
  return (
    <div className="flex gap-2 w-full">
      <StatusItem label="레이팅" value={`${eloScore}점`} isLoading={isLoading} />
      <StatusItem label="순위" value={`${rank}등`} isLoading={isLoading} />
      <StatusItem label="승률" value={`${winRate}%`} isLoading={isLoading} />
    </div>
  )
}

export default CharacterStatusSummary
