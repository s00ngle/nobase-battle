import { transparentForm } from '@/styles/form'
import type { TBattleResponse } from '@/types/Battle'

interface ResultProps {
  data: TBattleResponse
}

const BattleResult = ({ data }: ResultProps) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl">결과: {data.result}! </p>
      <div className={`flex flex-col ${transparentForm} w-full px-3 py-3 rounded-2xl gap-3`}>
        <span className="text-xl text-center">
          {data.firstCharacter.name} vs {data.secondCharacter.name}
        </span>
        <p className="text-lg">{data.battleLog}</p>
      </div>
    </div>
  )
}

export default BattleResult
