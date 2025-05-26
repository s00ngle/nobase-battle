'use client'

import { transparentForm } from '@/styles/form'
import type { IBattleResponse, TBattleResponse } from '@/types/Battle'
import Image from 'next/image'

interface ResultProps {
  data: TBattleResponse | IBattleResponse
  type?: 'text' | 'image'
}

const BattleResult = ({ data, type = 'text' }: ResultProps) => {
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
          {type !== 'image' && `${data?.firstCharacter.name} vs ${data?.secondCharacter.name}`}
        </span>
        {type === 'image' && (
          <div
            className="grid gap-y-2 items-center"
            style={{ gridTemplateColumns: '1fr auto 1fr', gridTemplateRows: '1fr auto' }}
          >
            <div className="w-full">
              <div className="relative aspect-video bg-white rounded-xl overflow-hidden">
                <Image
                  src={(data as IBattleResponse).firstCharacter.imageUrl}
                  alt={data.firstCharacter.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 45vw, 400px"
                  priority
                />
              </div>
            </div>
            <div className="text-2xl font-bold text-center px-3">VS</div>
            <div className="w-full">
              <div className="relative aspect-video bg-white rounded-xl overflow-hidden">
                <Image
                  src={(data as IBattleResponse).secondCharacter.imageUrl}
                  alt={data.secondCharacter.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 45vw, 400px"
                  priority
                />
              </div>
            </div>
            <div className="text-2xl text-center">{data.firstCharacter.name}</div>
            <div className="text-2xl" />
            <div className="text-2xl text-center">{data.secondCharacter.name}</div>
          </div>
        )}
        <p className="text-lg">{data?.battleLog}</p>
      </div>
    </div>
  )
}

export default BattleResult
