'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import InputBox from '@/components/common/InputBox'
import PaintingCanvas from '@/components/common/PaintingCanvas'
import TextArea from '@/components/common/TextArea'
import { BATTLE_LOADING_MESSAGES } from '@/constants/messages'
import useRandomMessage from '@/hooks/useRandomMessage'
import useTimer from '@/hooks/useTimer'
import { transparentForm } from '@/styles/form'
import type { ApiResponse, IBattleResponse, TBattleResponse } from '@/types/Battle'
import type { ICharacterResponse, TCharacterResponse } from '@/types/Character'
import { fetchRandomImageBattle, fetchRandomTextBattle } from '@/utils/api/battle'
import {
  deleteImageCharacter,
  deleteTextCharacter,
  getImageCharacter,
  getTextCharacter,
  updateImageCharacter,
  updateTextCharacter,
} from '@/utils/characters'
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

const Character = () => {
  const [result, setResult] = useState<boolean>(false)
  const [characterData, setCharacterData] = useState<
    TCharacterResponse | ICharacterResponse | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBattleLoading, setIsBattleLoading] = useState(false)
  const [battleResult, setBattleResult] = useState<TBattleResponse | IBattleResponse | null>(null)
  const [lastBattleTime, setLastBattleTime] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    prompt: '',
  })
  const resultRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const params = useParams()
  const type = params.type as 'text' | 'image'
  const id = params.id as string
  const router = useRouter()
  const { isActive, secondsLeft } = useTimer(lastBattleTime)
  const loadingMessage = useRandomMessage(BATTLE_LOADING_MESSAGES)

  useEffect(() => {
    if (result && battleResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [result, battleResult])

  const fetchCharacter = useCallback(async () => {
    try {
      let response: TCharacterResponse | ICharacterResponse
      if (type === 'text') {
        response = await getTextCharacter(id)
      } else if (type === 'image') {
        response = await getImageCharacter(id)
      } else {
        throw new Error('잘못된 캐릭터 타입입니다')
      }
      setCharacterData(response)
      if (type === 'text') {
        setEditForm({
          name: (response as TCharacterResponse).name,
          prompt: (response as TCharacterResponse).prompt,
        })
      } else {
        setEditForm({
          name: (response as ICharacterResponse).name,
          prompt: '',
        })
      }
    } catch (error) {
      console.error('캐릭터 정보를 불러오는데 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }, [type, id])

  useEffect(() => {
    fetchCharacter()
  }, [fetchCharacter])

  const resultHandler = async () => {
    try {
      setIsBattleLoading(true)
      let response: ApiResponse<TBattleResponse | IBattleResponse> | undefined
      if (type === 'text') {
        response = await fetchRandomTextBattle(id)
      } else if (type === 'image') {
        response = await fetchRandomImageBattle(id)
      }
      if (response?.data) {
        setBattleResult(response.data)
        setResult(true)
        setLastBattleTime(response.data.createdAt)
        await fetchCharacter()
      }
    } catch (error: unknown) {
      console.error('배틀 결과를 불러오는데 실패했습니다:', error)
      const apiError = error as ApiError
      if (apiError.response?.reason) {
        alert(apiError.response.reason)
      } else {
        alert('배틀 시작에 실패했습니다.')
      }
    } finally {
      setIsBattleLoading(false)
    }
  }

  const defaultData: TCharacterResponse = {
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
  }

  const defaultImageData: ICharacterResponse = {
    imageCharacterId: '',
    name: '',
    imageUrl: '',
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
      router.push('/')
    } catch (error) {
      console.error('캐릭터 삭제 중 오류 발생:', error)
      alert('캐릭터 삭제 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (characterData) {
      if (type === 'text') {
        setEditForm({
          name: (characterData as TCharacterResponse).name,
          prompt: (characterData as TCharacterResponse).prompt,
        })
      } else {
        setEditForm({
          name: (characterData as ICharacterResponse).name,
          prompt: '',
        })
      }
    }
  }

  const handleSaveEdit = async () => {
    try {
      if (type === 'text') {
        await updateTextCharacter(id, {
          name: editForm.name,
          prompt: editForm.prompt,
        })
      } else {
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

        await updateImageCharacter(id, {
          name: editForm.name,
          image: blob,
        })
      }

      alert('수정되었습니다.')
      setIsEditing(false)
      await fetchCharacter()
    } catch (error) {
      console.error('캐릭터 수정 중 오류 발생:', error)
      alert('캐릭터 수정 중 오류가 발생했습니다. 다시 시도해주세요.')
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
          {type === 'text' ? (
            <TextArea
              label="캐릭터 설명"
              value={editForm.prompt}
              onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
            />
          ) : (
            <PaintingCanvas
              canvasRef={canvasRef}
              initialImage={(characterData as ICharacterResponse)?.imageUrl}
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button text="취소" onClick={handleCancelEdit} />
          <Button text="저장" onClick={handleSaveEdit} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center gap-6 w-full max-w-150">
      {isEditing ? (
        renderEditForm()
      ) : (
        <CharacterInfo
          character={
            <CharacterItem
              nickname={isLoading ? '' : characterData?.name || ''}
              description={
                isLoading
                  ? ''
                  : type === 'text'
                    ? (characterData as TCharacterResponse)?.prompt
                    : undefined
              }
              imageUrl={
                isLoading
                  ? ''
                  : type === 'image'
                    ? (characterData as ICharacterResponse)?.imageUrl
                    : undefined
              }
              isLoading={isLoading}
              onDelete={() => handleDelete(id)}
              onEdit={handleEdit}
            />
          }
          data={
            isLoading || !characterData
              ? type === 'text'
                ? defaultData
                : defaultImageData
              : characterData
          }
          isLoading={isLoading}
        />
      )}
      <Button
        text={
          isBattleLoading
            ? loadingMessage
            : !isActive && lastBattleTime
              ? `${secondsLeft}초 후 배틀 가능`
              : '배틀 시작'
        }
        onClick={resultHandler}
        disabled={isBattleLoading || (!isActive && lastBattleTime !== null) || isEditing}
      />
      <div ref={resultRef}>
        {result && battleResult && <BattleResult data={battleResult} type={type} />}
      </div>
    </div>
  )
}

export default Character
