'use client'

import { transparentForm } from '@/styles/form'
import type { TBattleResponse } from '@/types/Battle'

interface ResultProps {
  data: TBattleResponse
}

const BattleResult = ({ data }: ResultProps) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xl">
        결과:{' '}
        <span
          className={
            data.result === 1 ? 'text-green-500' : data.result === -1 ? 'text-red-500' : ''
          }
        >
          {data.result === 1
            ? '승리'
            : data.result === 0
              ? '무승부'
              : data.result === -1
                ? '패배'
                : ''}
        </span>
      </p>
      <div className={`flex flex-col ${transparentForm} w-full px-3 py-3 rounded-2xl gap-3`}>
        <span className="text-xl text-center">
          {data?.firstCharacter.name} vs {data?.secondCharacter.name}
        </span>
        <p className="text-lg">{data?.battleLog}</p>
      </div>
    </div>
  )
}

export default BattleResult
