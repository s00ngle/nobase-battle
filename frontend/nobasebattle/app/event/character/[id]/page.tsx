'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import InputBox from '@/components/common/InputBox'
import PaintingCanvas from '@/components/common/PaintingCanvas'
import { BATTLE_LOADING_MESSAGES } from '@/constants/messages'
import useRandomMessage from '@/hooks/useRandomMessage'
import useTimer from '@/hooks/useTimer'
import { transparentForm } from '@/styles/form'
import type { IBattleResponse } from '@/types/Battle'
import type { ICharacterResponse } from '@/types/Character'
import { deleteImageCharacter, updateImageCharacter } from '@/utils/characters'
import { getEventCharacter, startEventBattle } from '@/utils/event'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ApiError {
  response: {
    status: number
    reason: string
    path: string
    success: boolean
    timeStamp: string
  }
}

const EventCharacterPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [character, setCharacter] = useState<ICharacterResponse | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
  })
  const [isBattleLoading, setIsBattleLoading] = useState(false)
  const [battleResult, setBattleResult] = useState<IBattleResponse | null>(null)
  const [lastBattleTime, setLastBattleTime] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const { isActive, secondsLeft } = useTimer(lastBattleTime)
  const loadingMessage = useRandomMessage(BATTLE_LOADING_MESSAGES)

  const fetchCharacter = useCallback(async () => {
    try {
      const response = await getEventCharacter(id as string)
      setCharacter(response)
      setEditForm({
        name: response.name,
      })
    } catch (error) {
      console.error('캐릭터 정보를 불러오는데 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCharacter()
  }, [fetchCharacter])

  useEffect(() => {
    if (battleResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [battleResult])

  const handleEventBattle = async () => {
    try {
      setIsBattleLoading(true)
      const response = await startEventBattle(id as string)
      setBattleResult(response)
      setLastBattleTime(response.createdAt)
      await fetchCharacter()
    } catch (error) {
      console.error('이벤트 배틀을 시작하는데 실패했습니다:', error)
      const apiError = error as ApiError
      if (apiError.response?.reason) {
        alert(apiError.response.reason)
      } else {
        alert('이벤트 배틀을 시작하는데 실패했습니다.')
      }
    } finally {
      setIsBattleLoading(false)
    }
  }

  const handleDeleteCharacter = async () => {
    try {
      const isConfirmed = confirm('정말로 이 캐릭터를 삭제하시겠습니까?')

      if (!isConfirmed) return

      await deleteImageCharacter(id as string)
      alert('삭제되었습니다.')
      router.push('/event/list')
    } catch (error) {
      console.error('캐릭터 삭제 중 오류 발생:', error)
      const apiError = error as ApiError
      if (apiError.response?.reason) {
        alert(apiError.response.reason)
      } else {
        alert('캐릭터 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    }
  }

  const handleEditCharacter = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (character) {
      setEditForm({
        name: character.name,
      })
    }
  }

  const handleSaveEdit = async () => {
    try {
      if (!canvasRef.current) {
        alert('그림을 그려주세요.')
        return
      }

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('이미지 변환에 실패했습니다.'))
          }
        }, 'image/png')
      })

      await updateImageCharacter(id as string, {
        name: editForm.name,
        image: blob,
      })

      alert('수정되었습니다.')
      setIsEditing(false)
      await fetchCharacter()
    } catch (error) {
      console.error('캐릭터 수정 중 오류 발생:', error)
      const apiError = error as ApiError
      if (apiError.response?.reason) {
        alert(apiError.response.reason)
      } else {
        alert('캐릭터 수정 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    }
  }

  const renderEditForm = () => {
    return (
      <div className={`flex flex-col gap-3 w-full p-3 rounded-2xl ${transparentForm}`}>
        <div className="flex flex-col gap-2">
          <InputBox
            label="캐릭터 이름(최대 20글자)"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            maxLength={20}
          />
          <PaintingCanvas canvasRef={canvasRef} initialImage={character?.imageUrl} />
        </div>
        <div className="flex justify-end gap-2">
          <Button text="취소" onClick={handleCancelEdit} />
          <Button text="저장" onClick={handleSaveEdit} />
        </div>
      </div>
    )
  }

  if (!character) {
    return null
  }

  return (
    <div className="flex flex-col justify-center gap-6 w-full max-w-150">
      {isEditing ? (
        renderEditForm()
      ) : (
        <CharacterInfo
          character={
            <CharacterItem
              nickname={character.name}
              imageUrl={character.imageUrl}
              isLoading={isLoading}
              onDelete={handleDeleteCharacter}
              onEdit={handleEditCharacter}
            />
          }
          data={character}
          isLoading={isLoading}
        />
      )}
      <Button
        text={
          isBattleLoading
            ? loadingMessage
            : !isActive && lastBattleTime
              ? `${secondsLeft}초 후 배틀 가능`
              : '이벤트 배틀 시작'
        }
        onClick={handleEventBattle}
        disabled={isEditing || isBattleLoading || (!isActive && lastBattleTime !== null)}
      />
      <div ref={resultRef}>{battleResult && <BattleResult data={battleResult} type="image" />}</div>
    </div>
  )
}

export default EventCharacterPage
