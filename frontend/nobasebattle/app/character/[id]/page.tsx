'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import { battleData } from '@/data/battleData'
import type { TCharacterResponse } from '@/types/Character'
import { getCharacter } from '@/utils/characters'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Character = () => {
  const params = useParams()
  const [result, setResult] = useState<boolean>(false)
  const [characterData, setCharacterData] = useState<TCharacterResponse | null>(null)

  const resultHandler = () => {
    setResult(true)
  }

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        if (!params.id) return
        const data = await getCharacter(params.id as string)
        setCharacterData(data)
        console.log('결과:', data)
      } catch (error) {
        console.error('캐릭터 정보를 불러오는데 실패했습니다:', error)
        // 에러 처리를 위한 상태 업데이트나 사용자 피드백을 추가할 수 있습니다
      }
    }
    fetchCharacter()
  }, [params.id])

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
