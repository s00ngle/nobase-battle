'use client'

import CharacterTypeButton from './CharacterTypeButton'
type CharacterType = 'text' | 'image'

interface CharacterTypeToggleProps {
  selectedType: CharacterType
  onChangeText?: () => void
  onChangeImage?: () => void
}

const CharacterTypeToggle = ({
  selectedType,
  onChangeText,
  onChangeImage,
}: CharacterTypeToggleProps) => {
  return (
    <div className="flex gap-3">
      <CharacterTypeButton
        text="텍스트 캐릭터"
        selected={selectedType === 'text'}
        onClick={onChangeText}
      />
      <CharacterTypeButton
        text="그림 캐릭터"
        selected={selectedType === 'image'}
        onClick={onChangeImage}
      />
    </div>
  )
}

export default CharacterTypeToggle
