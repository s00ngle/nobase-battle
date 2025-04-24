import { transparentForm } from '@/styles/form'

interface ResultProps {
  result: number
  battleLog: string
  firstCharacter: string
  secondCharacter: string
}

const BattleResult = ({ result, battleLog, firstCharacter, secondCharacter }: ResultProps) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl">결과: {result}! </p>
      <div className={`flex flex-col ${transparentForm} w-full px-3 py-3 rounded-2xl gap-3`}>
        <span className="text-xl text-center">
          {firstCharacter} vs {secondCharacter}
        </span>
        <p className="text-lg">{battleLog}</p>
      </div>
    </div>
  )
}

export default BattleResult
