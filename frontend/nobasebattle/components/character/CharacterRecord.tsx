import SkeletonLoading from '../common/SkeletonLoading'

interface RecordProps {
  totalBattles: number
  wins: number
  losses: number
  draws: number
  isLoading?: boolean
}

// 전적 항목 컴포넌트
const RecordItem = ({
  label,
  value,
  isLoading,
  textColor = '',
}: { label: string; value: number; isLoading: boolean; textColor?: string }) => {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <span className="text-base whitespace-nowrap">{label}</span>
      {isLoading ? (
        <SkeletonLoading width="3rem" height="1.5rem" className="rounded-lg" />
      ) : (
        <span className={`text-lg h-6 flex items-center ${textColor}`}>{value}</span>
      )}
    </div>
  )
}

const CharacterRecord = ({ totalBattles, wins, losses, draws, isLoading = false }: RecordProps) => {
  return (
    <div className="flex gap-4 sm:gap-8 w-full">
      <RecordItem label="배틀 수" value={totalBattles} isLoading={isLoading} />
      <RecordItem label="승리" value={wins} isLoading={isLoading} textColor="text-green-500" />
      <RecordItem label="패배" value={losses} isLoading={isLoading} textColor="text-red-500" />
      <RecordItem label="무승부" value={draws} isLoading={isLoading} />
    </div>
  )
}

export default CharacterRecord
