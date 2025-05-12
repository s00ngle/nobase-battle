'use client'

import { ErrorBoundary } from '@/app/components/common/ErrorBoundary'
import type { ImageCharacter, TextCharacter } from '@/app/types/character'
import CharacterList from '@/components/character/CharacterList'
import CharacterTypeToggle from '@/components/character/CharacterTypeToggle'
import Button from '@/components/common/Button'
import Invitation from '@/components/event/Invitation'
import { useCharacterStore } from '@/store/characterStore'
import {
  fetchImageCharacters,
  fetchTextCharacters,
  updateImageCharacter,
  updateTextCharacter,
} from '@/utils/characters'
import { getLatestEvent } from '@/utils/event'
import { sendGAEvent } from '@next/third-parties/google'
import { useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'

type CharacterType = 'text' | 'image'

const MainPage = () => {
  const { selectedType, setSelectedType } = useCharacterStore()
  const [textCharacters, setTextCharacters] = useState<TextCharacter[]>([])
  const [imageCharacters, setImageCharacters] = useState<ImageCharacter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadedTypes, setLoadedTypes] = useState<Set<CharacterType>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isInvitationOpen, setIsInvitationOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()

  const fetchCharacters = useCallback(async () => {
    try {
      setIsLoading(true)
      if (selectedType === 'text') {
        const characters = await fetchTextCharacters()
        setTextCharacters(characters)
      } else {
        const characters = await fetchImageCharacters()
        setImageCharacters(characters)
      }
      setError(null)
      setLoadedTypes((prev) => new Set(prev).add(selectedType))
    } catch (err) {
      console.error('Error fetching characters:', err)
      setError('캐릭터 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedType])

  useEffect(() => {
    fetchCharacters()
  }, [fetchCharacters])

  const handleClickText = useCallback(() => {
    setEditingId(null)
    setSelectedType('text')
  }, [setSelectedType])

  const handleClickImage = useCallback(() => {
    setEditingId(null)
    setSelectedType('image')
  }, [setSelectedType])

  const currentCharacters = useMemo(() => {
    return selectedType === 'text' ? textCharacters : imageCharacters
  }, [selectedType, textCharacters, imageCharacters])

  const handleUpdate = useCallback(
    async (id: string, data: { name: string; prompt?: string; image?: Blob }) => {
      try {
        if (selectedType === 'text' && data.prompt) {
          await updateTextCharacter(id, {
            name: data.name,
            prompt: data.prompt,
          })
        } else if (selectedType === 'image' && data.image) {
          await updateImageCharacter(id, {
            name: data.name,
            image: data.image,
          })
        }
        await fetchCharacters()
      } catch (error) {
        console.error('캐릭터 수정 중 오류 발생:', error)
        throw error
      }
    },
    [selectedType, fetchCharacters],
  )

  const characterList = useMemo(
    () => (
      <CharacterList
        characters={currentCharacters}
        type={selectedType}
        isLoading={isLoading && !loadedTypes.has(selectedType)}
        onDelete={fetchCharacters}
        onUpdate={handleUpdate}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    ),
    [
      currentCharacters,
      selectedType,
      isLoading,
      loadedTypes,
      fetchCharacters,
      handleUpdate,
      editingId,
    ],
  )

  const characterTypeToggle = useMemo(
    () => (
      <CharacterTypeToggle
        selectedType={selectedType}
        onChangeText={handleClickText}
        onChangeImage={handleClickImage}
      />
    ),
    [selectedType, handleClickText, handleClickImage],
  )

  const handleCreateClick = useCallback(
    (type: CharacterType) => {
      const characterCount = type === 'text' ? textCharacters.length : imageCharacters.length
      if (characterCount >= 5) {
        alert('캐릭터는 최대 5개까지만 생성할 수 있습니다.')
        return
      }
      setSelectedType(type)
      router.push(`/create/${type}`)
    },
    [router, textCharacters.length, imageCharacters.length, setSelectedType],
  )

  const joinEvent = () => {
    router.push('/event')
    setIsInvitationOpen(false)
    sendGAEvent('event', 'join_event', {
      event_category: 'event',
      event_label: 'join_event',
      value: 1,
    })
  }

  const HideTodayHandler = () => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    localStorage.setItem('hideInvitationUntil', today.getTime().toString())
    setIsInvitationOpen(false)
    sendGAEvent('event', 'hide_event', {
      event_category: 'event',
      event_label: 'hide_event',
      value: 1,
    })
  }

  useEffect(() => {
    const checkEventStatus = async () => {
      try {
        const event = await getLatestEvent()
        const now = new Date()
        const endTime = new Date(event.data.endTime)

        if (now <= endTime) {
          const hideUntil = localStorage.getItem('hideInvitationUntil')
          if (!hideUntil || Number(hideUntil) <= Date.now()) {
            setIsInvitationOpen(true)
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error)
      }
    }

    checkEventStatus()
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full max-w-150 flex flex-col items-center gap-6">
      {isInvitationOpen && (
        <Invitation
          onClose={() => setIsInvitationOpen(false)}
          onJoin={joinEvent}
          onHide={HideTodayHandler}
        />
      )}

      {characterTypeToggle}
      <ErrorBoundary>
        <Suspense fallback={<div>로딩 중...</div>}>
          {error ? <div>{error}</div> : characterList}
        </Suspense>
      </ErrorBoundary>

      <div className="flex flex-col gap-3">
        {selectedType === 'text' && (
          <Button text="텍스트로 캐릭터 생성" onClick={() => handleCreateClick('text')} />
        )}
        {selectedType === 'image' && (
          <Button text="그림으로 캐릭터 생성" onClick={() => handleCreateClick('image')} />
        )}
      </div>
    </div>
  )
}

export default MainPage
