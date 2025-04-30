'use client'

import { transparentForm } from '@/styles/form'
import type { IBattleResponse, TBattleResponse } from '@/types/Battle'
import Image from 'next/image'
import Button from '../common/Button'

interface BattleResultProps {
  battleResult: TBattleResponse | IBattleResponse
  isTextBattle: boolean
  onRetry: () => void
  onSelectCharacter: () => void
  isLoading: boolean
}

const BattleResult = ({
  battleResult,
  isTextBattle,
  onRetry,
  onSelectCharacter,
  isLoading,
}: BattleResultProps) => {
  if (!battleResult) {
    return (
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="text-red-500 text-lg">배틀 결과를 불러오는데 실패했습니다.</div>
        <button
          type="button"
          onClick={onRetry}
          className={`${transparentForm} px-6 py-2 text-lg font-semibold`}
        >
          다시 시도
        </button>
      </div>
    )
  }

  const isChallengerWinner = battleResult.result === 1

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-full max-w-2xl">
        <div
          className="grid gap-y-2 items-center"
          style={{ gridTemplateColumns: '1fr auto 1fr', gridTemplateRows: '1fr auto' }}
        >
          <div className="text-2xl text-center">
            {isLoading ? (
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
            ) : (
              battleResult.firstCharacter.name
            )}
          </div>
          <div className="text-2xl font-bold text-center px-3">VS</div>
          <div className="text-2xl text-center">
            {isLoading ? (
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
            ) : (
              battleResult.secondCharacter.name
            )}
          </div>
          {!isTextBattle && (
            <>
              <div className="w-full">
                <div className="relative aspect-video bg-white rounded-xl">
                  {isLoading ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  ) : (
                    <Image
                      src={(battleResult as IBattleResponse).firstCharacter.imageUrl}
                      alt={battleResult.firstCharacter.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 45vw, 400px"
                      priority
                    />
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold text-center px-3" />
              <div className="w-full">
                <div className="relative aspect-video bg-white rounded-xl">
                  {isLoading ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  ) : (
                    <Image
                      src={(battleResult as IBattleResponse).secondCharacter.imageUrl}
                      alt={battleResult.secondCharacter.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 45vw, 400px"
                      priority
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 text-center">
          <h2
            className={`text-3xl font-bold mb-2 ${
              isChallengerWinner ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isLoading ? (
              <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
            ) : isChallengerWinner ? (
              '승리!'
            ) : (
              '패배...'
            )}
          </h2>
          {isLoading ? (
            <div className="text-lg mb-4">
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
              </div>
            </div>
          ) : (
            <p className="text-lg mb-4">{battleResult.battleLog}</p>
          )}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={onRetry}
              text="다시 도전"
              className={`${transparentForm} px-6 py-2 text-lg font-semibold rounded-lg cursor-pointer`}
              disabled={isLoading}
            />
            <Button
              onClick={onSelectCharacter}
              text="캐릭터 선택"
              className={`${transparentForm} px-6 py-2 text-lg font-semibold rounded-lg cursor-pointer`}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BattleResult
