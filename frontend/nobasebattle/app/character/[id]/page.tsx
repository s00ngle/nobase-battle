'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import Loading from '@/components/common/Loading'
import { battleData } from '@/data/battleData'
import type { TCharacterResponse } from '@/types/Character'
import { getCharacter } from '@/utils/characters'
import { useEffect, useState } from 'react'

const Character = () => {
  const [result, setResult] = useState<boolean>(false)
  const [characterData, setCharacterData] = useState<TCharacterResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const id = '6808830b9de4765e66289dad'

  const resultHandler = () => {
    setResult(true)
  }

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const data = await getCharacter(id)
        setCharacterData(data)
        console.log('결과:', data)
        // API 호출 후 2초 동안 로딩 유지
        await new Promise((resolve) => setTimeout(resolve, 20000))
      } catch (error) {
        console.error('캐릭터 정보를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCharacter()
  }, [])

  if (isLoading) {
    return <Loading className="flex justify-center items-center h-screen -translate-y-30" />
  }

  return (
    <div className="flex flex-col justify-center gap-6 max-w-150">
      {characterData && (
        <CharacterInfo
          character={
            <CharacterItem nickname={characterData?.name} description={characterData?.prompt} />
          }
          data={characterData}
        />
      )}
      <Button text={'배틀 시작'} onClick={resultHandler} />
      {result && <BattleResult data={battleData.data} />}
    </div>
  )
}

export default Character
