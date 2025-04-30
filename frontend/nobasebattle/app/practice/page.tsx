'use client'

import type { ImageCharacter, TextCharacter } from '@/app/types/character'
import BattleResult from '@/components/battle/BattleResult'
import Button from '@/components/common/Button'
import { transparentForm } from '@/styles/form'
import type { IBattleResponse, TBattleResponse } from '@/types/Battle'
import type {} from '@/types/Character'
import { fetchChallengeImageBattle, fetchChallengeTextBattle } from '@/utils/api/battle'
import { fetchImageCharacters, fetchTextCharacters } from '@/utils/characters'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const isTextCharacter = (character: TextCharacter | ImageCharacter): character is TextCharacter => {
  return 'textCharacterId' in character
}

const isImageCharacter = (
  character: TextCharacter | ImageCharacter,
): character is ImageCharacter => {
  return 'imageCharacterId' in character
}

const PracticePage = () => {
  const searchParams = useSearchParams()
  const opponentId = searchParams.get('opponentId')
  const opponentName = searchParams.get('name')
  const opponentImageUrl = searchParams.get('imageUrl')
  const isText = searchParams.get('type') === 'text'

  const [characters, setCharacters] = useState<(TextCharacter | ImageCharacter)[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [battleResult, setBattleResult] = useState<TBattleResponse | IBattleResponse | null>(null)

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = isText ? await fetchTextCharacters() : await fetchImageCharacters()
        setCharacters(response)
      } catch (error) {
        console.error('캐릭터 목록을 불러오는데 실패했습니다:', error)
      }
    }

    fetchCharacters()
  }, [isText])

  const handleStartBattle = async () => {
    if (!selectedCharacter || !opponentId) return

    // 스켈레톤 UI를 보여주기 위한 초기 battleResult 설정
    const skeletonResult = {
      battleId: '',
      firstCharacter: {
        characterId: selectedCharacter,
        name: '',
        prompt: '',
        record: {
          eloScore: 0,
          winRate: 0,
          totalBattles: 0,
          wins: 0,
          losses: 0,
          draws: 0,
        },
      },
      secondCharacter: {
        characterId: opponentId,
        name: '',
        prompt: '',
        record: {
          eloScore: 0,
          winRate: 0,
          totalBattles: 0,
          wins: 0,
          losses: 0,
          draws: 0,
        },
      },
      result: 0,
      battleLog: '',
      createdAt: new Date().toISOString(),
    } as TBattleResponse | IBattleResponse

    setBattleResult(skeletonResult)
    setIsLoading(true)

    try {
      if (isText) {
        const response = await fetchChallengeTextBattle(selectedCharacter, opponentId)
        setBattleResult(response.data)
      } else {
        const response = await fetchChallengeImageBattle(selectedCharacter, opponentId)
        setBattleResult(response.data)
      }
    } catch (error) {
      console.error('배틀 시작에 실패했습니다:', error)
      setBattleResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    handleStartBattle()
  }

  const handleSelectCharacter = () => {
    setBattleResult(null)
  }

  if (!opponentId) {
    return <div>잘못된 접근입니다.</div>
  }

  if (battleResult) {
    return (
      <BattleResult
        battleResult={battleResult}
        onRetry={handleRetry}
        onSelectCharacter={handleSelectCharacter}
        isTextBattle={isText}
        isLoading={isLoading}
      />
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full max-w-150">
      <h1 className="text-2xl font-bold">연습 배틀</h1>
      {opponentName && (
        <div className={`w-full max-w-150 p-6 border rounded-lg ${transparentForm} shadow-sm`}>
          <h2 className="text-xl font-semibold mb-4">상대 캐릭터</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {!isText && opponentImageUrl && (
              <div className="relative w-64 h-36 rounded-lg overflow-hidden bg-white">
                <Image
                  src={opponentImageUrl}
                  alt={opponentName}
                  fill
                  sizes="(max-width: 256px) 100vw, 256px"
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <div className="flex-1">
              <div className="text-2xl font-bold mb-2">{opponentName}</div>
              <div className="text-gray-600 dark:text-gray-300">
                {isText ? '텍스트 캐릭터' : '이미지 캐릭터'}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-150">
        <h2 className="text-xl mb-4">내 캐릭터 선택</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {characters.map((character) => {
            const characterId = isTextCharacter(character)
              ? character.textCharacterId
              : character.imageCharacterId
            return (
              <div
                key={characterId}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedCharacter === characterId
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedCharacter(characterId)}
              >
                <div className="font-semibold">{character.name}</div>
                {isImageCharacter(character) && (
                  <div className="relative w-full aspect-video rounded overflow-hidden bg-white">
                    <Image
                      src={character.imageUrl}
                      alt={character.name}
                      fill
                      sizes="(max-width: 100%) 100vw, 100%"
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <Button
        text="배틀 시작"
        onClick={handleStartBattle}
        disabled={!selectedCharacter || isLoading}
      />
    </div>
  )
}

export default PracticePage
