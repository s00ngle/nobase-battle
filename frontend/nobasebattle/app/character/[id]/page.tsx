'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import type { TBattleResponse } from '@/types/Battle'
import type { TCharacterResponse } from '@/types/Character'
import { getCharacter } from '@/utils/characters'
import { useEffect, useState } from 'react'

const Character = () => {
  const [result, setResult] = useState<boolean>(false)
  const [characterData, setCharacterData] = useState<TCharacterResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [battleResult, setBattleResult] = useState<TBattleResponse | null>(null)
  const id = '6808830b9de4765e66289dad'

  const resultHandler = async () => {
    try {
      const response = await fetch('/api/v1/battles/text', {
        method: 'POST',
        body: JSON.stringify({ characterId: id, mode: 'text' }),
      })
      const data = await response.json()
      setBattleResult(data)
      setResult(true)
    } catch (error) {
      console.error('배틀 결과를 불러오는데 실패했습니다:', error)
    }
  }

  // 배틀 값 확인
  useEffect(() => {
    if (battleResult) {
      console.log('배틀 결과:', battleResult)
    }
  }, [battleResult])

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await getCharacter(id)
        setCharacterData(data)
        console.log('결과:', data)
      } catch (error) {
        console.error('캐릭터 정보를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCharacter()
  }, [])

  return (
    <div className="flex flex-col justify-center gap-6 w-full max-w-150">
      <CharacterInfo
        character={
          <CharacterItem
            nickname={characterData?.name || ''}
            description={characterData?.prompt || ''}
            isLoading={isLoading}
          />
        }
        data={
          isLoading
            ? {
                name: '',
                prompt: '',
                eloScore: 0,
                rank: 0,
                winRate: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                totalBattles: 0,
                badges: [],
                textCharacterId: '',
              }
            : characterData || {
                name: '',
                prompt: '',
                eloScore: 0,
                rank: 0,
                winRate: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                totalBattles: 0,
                badges: [],
                textCharacterId: '',
              }
        }
        isLoading={isLoading}
      />
      <Button text={'배틀 시작'} onClick={resultHandler} />
      {result && battleResult && <BattleResult data={battleResult} />}
    </div>
  )
}

export default Character
