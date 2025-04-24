interface RecordProps {
  totalBattles: number
  wins: number
  losses: number
  draws: number
}

const CharacterRecord = ({ totalBattles, wins, losses, draws }: RecordProps) => {
  return (
    <div className="flex gap-8 w-full">
      <div className="flex flex-col items-center gap-3 w-full">
        <span className="text-base whitespace-nowrap">배틀 수</span>
        <span className="text-lg">{totalBattles}</span>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <span className="text-base whitespace-nowrap">승리</span>
        <span className="text-lg text-green-500">{wins}</span>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <span className="text-base whitespace-nowrap">패배</span>
        <span className="text-lg text-red-500">{losses}</span>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <span className="text-base whitespace-nowrap">무승부</span>
        <span className="text-lg">{draws}</span>
      </div>
    </div>
  )
}

export default CharacterRecord
