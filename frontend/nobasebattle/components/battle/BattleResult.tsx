'use client'

import { transparentForm } from '@/styles/form'
import type { IBattleResponse, TBattleResponse } from '@/types/Battle'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../common/Button'

interface BattleResultProps {
  battleResult: TBattleResponse | IBattleResponse
  isTextBattle: boolean
  onRetry: () => void
  onSelectCharacter: () => void
  isLoading: boolean
}

const COOLDOWN_TIME = 10

const BattleResult = ({
  battleResult,
  isTextBattle,
  onRetry,
  onSelectCharacter,
  isLoading,
}: BattleResultProps) => {
  const [cooldown, setCooldown] = useState(COOLDOWN_TIME)
  const [isCooldown, setIsCooldown] = useState(false)

  useEffect(() => {
    if (!isLoading && !isCooldown) {
      setIsCooldown(true)
      setCooldown(COOLDOWN_TIME)
    }
  }, [isLoading, isCooldown])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCooldown && cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
    } else if (cooldown === 0) {
      setIsCooldown(false)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [cooldown, isCooldown])

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
  const isDraw = battleResult.result === 0

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
          <div className="text-2xl font-bold text-center px-3">{!isLoading && 'VS'}</div>
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
              isLoading
                ? 'text-yellow-500'
                : isDraw
                  ? 'text-gray-500'
                  : isChallengerWinner
                    ? 'text-green-500'
                    : 'text-red-500'
            }`}
          >
            {isLoading ? (
              <div className="text-yellow-500">배틀 중</div>
            ) : isDraw ? (
              '무승부!'
            ) : isChallengerWinner ? (
              '승리!'
            ) : (
              '패배...'
            )}
          </h2>
          {isLoading ? (
            <div className="text-lg mb-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent" />
              </div>
            </div>
          ) : (
            <p className="text-lg mb-4 whitespace-pre-line">{battleResult.battleLog}</p>
          )}
          {!isLoading && (
            <div className="flex flex-col gap-4 items-center">
              <Button
                onClick={onRetry}
                text={isCooldown ? `다시 도전 (${cooldown}초)` : '다시 도전'}
                className={`${transparentForm} whitespace-nowrap`}
                disabled={isCooldown}
              />
              <Button
                onClick={onSelectCharacter}
                text="캐릭터 선택"
                className={`${transparentForm}`}
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BattleResult
