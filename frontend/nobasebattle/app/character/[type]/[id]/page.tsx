'use client'

import BattleResult from '@/components/character/BattleResult'
import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import Button from '@/components/common/Button'
import { BATTLE_LOADING_MESSAGES } from '@/constants/messages'
import useRandomMessage from '@/hooks/useRandomMessage'
import useTimer from '@/hooks/useTimer'
import type { ApiResponse, IBattleResponse, TBattleResponse } from '@/types/Battle'
import type { ICharacterResponse, TCharacterResponse } from '@/types/Character'
import { fetchRandomImageBattle, fetchRandomTextBattle } from '@/utils/api/battle'
import {
  deleteImageCharacter,
  deleteTextCharacter,
  getImageCharacter,
  getTextCharacter,
} from '@/utils/characters'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

const Character = () => {
  const [result, setResult] = useState<boolean>(false)
  const [characterData, setCharacterData] = useState<
    TCharacterResponse | ICharacterResponse | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBattleLoading, setIsBattleLoading] = useState(false)
  const [battleResult, setBattleResult] = useState<TBattleResponse | IBattleResponse | null>(null)
  const [lastBattleTime, setLastBattleTime] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
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
    } catch (error) {
      console.error('배틀 결과를 불러오는데 실패했습니다:', error)
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

  const handleEdit = (id: string) => {
    alert(`edit id: ${id}`)
  }
  return (
    <div className="flex flex-col justify-center gap-6 w-full max-w-150">
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
            onEdit={() => handleEdit(id)}
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
      <Button
        text={
          isBattleLoading
            ? loadingMessage
            : !isActive && lastBattleTime
              ? `${secondsLeft}초 후 배틀 가능`
              : '배틀 시작'
        }
        onClick={resultHandler}
        disabled={isBattleLoading || (!isActive && lastBattleTime !== null)}
      />
      <div ref={resultRef}>
        {result && battleResult && <BattleResult data={battleResult} type={type} />}
      </div>
    </div>
  )
}

export default Character
