'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import type { TBattleResponse } from '@/types/Battle'
import type { TCharacterResponse } from '@/types/Character'
import { fetchRandomTextBattle } from '@/utils/api/battle'
import { getCharacter } from '@/utils/characters'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Character = () => {
  const [result, setResult] = useState<boolean>(false)
  const [characterData, setCharacterData] = useState<TCharacterResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [battleResult, setBattleResult] = useState<TBattleResponse | null>(null)
  const { id } = useParams<{ id: string }>()

  const resultHandler = async () => {
    try {
      const response = await fetchRandomTextBattle(id)
      setBattleResult(response.data)
      setResult(true)
    } catch (error) {
      console.error('배틀 결과를 불러오는데 실패했습니다:', error)
    }
  }

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await getCharacter(id)
        setCharacterData(response)
      } catch (error) {
        console.error('캐릭터 정보를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCharacter()
  }, [id])


  const defaultData: TCharacterResponse = {
    data: {
      textCharacterId: '',
      name: '',
      prompt: '',
      wins: 0,
      losses: 0,
      draws: 0,
      totalBattles: 0,
      winRate: 0,
      eloScore: 0,
      rank: 0,
      badges: [],
      createdAt: '',
      updatedAt: '',
    },
  }

  return (
    <div className="flex flex-col justify-center gap-6 w-full max-w-150">
      <CharacterInfo
        character={
          <CharacterItem
            nickname={isLoading ? '' : characterData?.data.name || ''}
            description={isLoading ? '' : characterData?.data.prompt || ''}
            isLoading={isLoading}
          />
        }
        data={isLoading ? defaultData.data : (characterData?.data ?? defaultData.data)}
        isLoading={isLoading}
      />
      <Button text={'배틀 시작'} onClick={resultHandler} />
      {result && battleResult && <BattleResult data={battleResult} />}
    </div>
  )
}

export default Character
