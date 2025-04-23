'use client'
import CharacterList from '@/components/character/CharacterList'
import CharacterTypeToggle from '@/components/character/CharacterTypeToggle'
import Button from '@/components/common/Button'
import { useState } from 'react'

type CharacterType = 'text' | 'image'

const MainPage = () => {
  const [selectedType, setSelectedType] = useState<CharacterType>('text')

  const handleClickText = () => {
    setSelectedType('text')
  }

  const handleClickImage = () => {
    setSelectedType('image')
  }

  return (
    <div className="w-full max-w-150 flex flex-col items-center gap-6 ">
      <CharacterTypeToggle
        selectedType={selectedType}
        onChangeText={handleClickText}
        onChangeImage={handleClickImage}
      />

      <CharacterList />

      <div className="flex flex-col gap-3">
        <Button text="텍스트로 캐릭터 생성" />
        <Button text="그림으로 캐릭터 생성" />
      </div>
    </div>
  )
}

export default MainPage
