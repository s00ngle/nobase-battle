import type { ImageCharacter, TextCharacter } from '@/app/types/character'
import { transparentForm } from '@/styles/form'
import { useRouter } from 'next/navigation'
import IconButton from '../common/IconButton'
import SkeletonLoading from '../common/SkeletonLoading'
import CharacterItem from './CharacterItem'

type CharacterType = 'text' | 'image'

interface CharacterListProps {
  characters: TextCharacter[] | ImageCharacter[]
  type: CharacterType
  isLoading?: boolean
  maxCount?: number
}

const CharacterList = ({
  characters,
  type,
  isLoading = false,
  maxCount = 5,
}: CharacterListProps) => {
  const router = useRouter()

  const handleCharacterClick = (id: string) => {
    router.push(`/character/${id}`)
  }

  return (
    <div className={`flex flex-col gap-3 w-full flex-1 rounded-2xl p-4 ${transparentForm}`}>
      <div className="flex items-center gap-2">
        <div className="text-xl">
          {type === 'text' ? '텍스트 캐릭터 목록' : '이미지 캐릭터 목록'}
        </div>
        <div className="text-base text-gray-800 dark:text-gray-200">
          ({characters.length}/{maxCount})
        </div>
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={`skeleton-loading-${index}-${Date.now()}`}
              className={`flex flex-col gap-3 w-full p-3 rounded-2xl ${transparentForm}`}
            >
              <div className="flex justify-between">
                <SkeletonLoading width="8rem" height="1.5rem" className="rounded-md" />
                <div className="flex gap-2">
                  <IconButton icon="pen.svg" />
                  <IconButton icon="delete.svg" />
                </div>
              </div>
              {type === 'text' && (
                <SkeletonLoading width="12rem" height="1.5rem" className="rounded-md" />
              )}
            </div>
          ))}
        </div>
      ) : characters.length === 0 ? (
        <div className="text-2xl">캐릭터가 아직 없어요</div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {characters.map((character) => {
            if (type === 'text') {
              const textChar = character as TextCharacter
              return (
                <CharacterItem
                  key={textChar.textCharacterId}
                  nickname={textChar.name}
                  description={textChar.prompt}
                  onClick={() => handleCharacterClick(textChar.textCharacterId)}
                />
              )
            }
            const imageChar = character as ImageCharacter
            return (
              <CharacterItem
                key={imageChar.imageCharacterId}
                nickname={imageChar.name}
                onClick={() => handleCharacterClick(imageChar.imageCharacterId)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CharacterList
