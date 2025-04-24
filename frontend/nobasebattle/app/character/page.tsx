'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import { battleData } from '@/data/battleData'
import { characterData } from '@/data/characterInfo'
import { useState } from 'react'

const Character = () => {
  const [result, setResult] = useState<boolean>(false)

  const resultHandler = () => {
    setResult(true)
  }

  return (
    <div className="flex flex-col justify-center gap-6 max-w-150">
      <CharacterInfo
        character={
          <CharacterItem nickname={characterData.name} description={characterData.prompt} />
        }
        data={characterData}
      />
      <Button text={'배틀 시작'} onClick={resultHandler} />
      {result && <BattleResult data={battleData.data} />}
    </div>
  )
}

export default Character
