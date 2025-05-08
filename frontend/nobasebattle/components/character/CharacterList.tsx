import type { ImageCharacter, TextCharacter } from '@/app/types/character'
import { transparentForm } from '@/styles/form'
import { deleteTextCharacter } from '@/utils/characters'
import { deleteImageCharacter } from '@/utils/characters'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import Button from '../common/Button'
import IconButton from '../common/IconButton'
import InputBox from '../common/InputBox'
import PaintingCanvas from '../common/PaintingCanvas'
import SkeletonLoading from '../common/SkeletonLoading'
import TextArea from '../common/TextArea'
import CharacterItem from './CharacterItem'

type CharacterType = 'text' | 'image'

interface UpdateTextCharacter {
  name: string
  prompt: string
}

interface UpdateImageCharacter {
  name: string
  image: Blob
}

type UpdateCharacter = UpdateTextCharacter | UpdateImageCharacter

interface CharacterListProps {
  characters: TextCharacter[] | ImageCharacter[]
  type: CharacterType
  isLoading?: boolean
  maxCount?: number
  onDelete?: () => void
  onUpdate?: (id: string, data: UpdateCharacter) => Promise<void>
  editingId: string | null
  setEditingId: (id: string | null) => void
}

const CharacterList = ({
  characters,
  type,
  isLoading = false,
  maxCount = 5,
  onDelete,
  onUpdate,
  editingId,
  setEditingId,
}: CharacterListProps) => {
  const router = useRouter()
  const [editForm, setEditForm] = useState({
    name: '',
    prompt: '',
    imageUrl: '',
  })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasKey, setCanvasKey] = useState(0)

  const handleCharacterClick = (id: string) => {
    if (editingId) {
      handleCancelEdit()
      return
    }
    router.push(`/character/${type}/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const isConfirmed = confirm('정말로 이 캐릭터를 삭제하시겠습니까?')

      if (!isConfirmed) return

      if (type === 'text') {
        await deleteTextCharacter(id)
      } else if (type === 'image') {
        await deleteImageCharacter(id)
      }
      alert('삭제되었습니다.')
      onDelete?.()
    } catch (error) {
      console.error('캐릭터 삭제 중 오류 발생:', error)
      alert('캐릭터 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const handleEdit = (character: TextCharacter | ImageCharacter) => {
    if (type === 'text') {
      const textChar = character as TextCharacter
      setEditForm({
        name: textChar.name,
        prompt: textChar.prompt,
        imageUrl: '',
      })
      setEditingId(textChar.textCharacterId)
    } else {
      const imageChar = character as ImageCharacter
      setEditForm({
        name: imageChar.name,
        prompt: '',
        imageUrl: imageChar.imageUrl,
      })
      setCanvasKey((prevKey) => prevKey + 1)
      setEditingId(imageChar.imageCharacterId)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', prompt: '', imageUrl: '' })
    setCanvasKey((prevKey) => prevKey + 1)
  }

  const handleSaveEdit = async (id: string) => {
    try {
      if (!onUpdate) return

      if (editForm.name.trim() === '') {
        alert('캐릭터 이름을 입력해주세요.')
        return
      }

      if (type === 'text') {
        if (editForm.prompt.trim() === '') {
          alert('캐릭터 설명을 입력해주세요.')
          return
        }
        await onUpdate(id, { name: editForm.name.trim(), prompt: editForm.prompt.trim() })
      } else {
        if (!canvasRef.current) {
          alert('그림을 그려주세요.')
          return
        }

        // Canvas를 Blob으로 변환
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvasRef.current?.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('이미지 변환에 실패했습니다.'))
            }
          }, 'image/png')
        })

        await onUpdate(id, { name: editForm.name, image: blob })
      }

      setEditingId(null)
      setEditForm({ name: '', prompt: '', imageUrl: '' })
      setCanvasKey((prevKey) => prevKey + 1)
      alert('수정되었습니다.')
    } catch (error) {
      console.error('캐릭터 수정 중 오류 발생:', error)
      alert('캐릭터 수정 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const renderEditForm = (character: TextCharacter | ImageCharacter) => {
    const isTextChar = type === 'text'
    const id = isTextChar
      ? (character as TextCharacter).textCharacterId
      : (character as ImageCharacter).imageCharacterId

    return (
      <div key={id} className={`flex flex-col gap-3 w-full p-3 rounded-2xl ${transparentForm}`}>
        <div className="flex flex-col gap-2">
          <InputBox
            label="캐릭터 이름(최대 20글자)"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            maxLength={20}
          />
          {isTextChar ? (
            <TextArea
              label="캐릭터 설명"
              value={editForm.prompt}
              onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
            />
          ) : (
            <PaintingCanvas
              key={canvasKey}
              canvasRef={canvasRef}
              initialImage={editForm.imageUrl}
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button text="취소" onClick={handleCancelEdit} />
          <Button text="저장" onClick={() => handleSaveEdit(id)} />
        </div>
      </div>
    )
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
              return editingId === textChar.textCharacterId ? (
                renderEditForm(textChar)
              ) : (
                <CharacterItem
                  key={textChar.textCharacterId}
                  nickname={textChar.name}
                  description={textChar.prompt}
                  onClick={() => handleCharacterClick(textChar.textCharacterId)}
                  onDelete={() => handleDelete(textChar.textCharacterId)}
                  onEdit={() => handleEdit(textChar)}
                  winStreak={textChar.winStreak ?? undefined}
                  loseStreak={textChar.loseStreak ?? undefined}
                />
              )
            }
            const imageChar = character as ImageCharacter
            return editingId === imageChar.imageCharacterId ? (
              renderEditForm(imageChar)
            ) : (
              <CharacterItem
                key={imageChar.imageCharacterId}
                nickname={imageChar.name}
                onClick={() => handleCharacterClick(imageChar.imageCharacterId)}
                imageUrl={imageChar.imageUrl}
                imageSize="sm"
                onDelete={() => handleDelete(imageChar.imageCharacterId)}
                onEdit={() => handleEdit(imageChar)}
                winStreak={imageChar.winStreak ?? undefined}
                loseStreak={imageChar.loseStreak ?? undefined}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CharacterList
