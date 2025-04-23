'use client'

import CharacterTypeToggle from '@/components/character/CharacterTypeToggle'
import { useState } from 'react'

type CharacterType = 'text' | 'image'

const TestPage = () => {
  const [selectedType, setSelectedType] = useState<CharacterType>('text')

  const handleClickText = () => {
    setSelectedType('text')
  }

  const handleClickImage = () => {
    setSelectedType('image')
  }

  return (
    <div>
      <div className="text-5xl">Test Page</div>
      <CharacterTypeToggle
        selectedType={selectedType}
        onChangeText={handleClickText}
        onChangeImage={handleClickImage}
      />
    </div>
  )
}

export default TestPage
