'use client'

import type { ImageCharacter } from '@/app/types/character'
import Button from '@/components/common/Button'
import SkeletonLoading from '@/components/common/SkeletonLoading'
import { hover, transparentForm } from '@/styles/form'
import { fetchImageCharacters } from '@/utils/characters'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const EventCharacterListPage = () => {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [characters, setCharacters] = useState<ImageCharacter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await fetchImageCharacters()
        setCharacters(data)
      } catch (error) {
        console.error('캐릭터 목록을 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCharacters()
  }, [])

  const handleApply = () => {
    router.push(`/event/character/${selectedCharacter}`)
  }

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(selectedCharacter === characterId ? null : characterId)
  }

  if (!isLoading && characters.length === 0) {
    return (
      <div className="w-full max-w-150 flex flex-col items-center gap-6">
        <h2 className="text-xl mb-4">이벤트 참여 캐릭터 선택</h2>
        <div className="w-full p-8 text-center border rounded-lg bg-gray-50 dark:bg-gray-800">
          <p className="text-lg mb-4">그림 캐릭터가 하나도 없습니다.</p>
          <Button text="캐릭터 만들기" onClick={() => router.push('/create/image')} />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-150 flex flex-col items-center gap-6">
      <h2 className="text-xl mb-4">이벤트 참여 캐릭터 선택</h2>
      <div className="grid grid-cols-2 gap-4 w-full">
        {isLoading
          ? // 로딩 중일 때 스켈레톤 UI 표시
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`skeleton-${index}-${Math.random()}`}
                className={`p-4 border rounded-lg ${transparentForm}`}
              >
                <SkeletonLoading width="8rem" height="16px" className="rounded-sm mb-2" />
                <div className="relative w-full aspect-video rounded overflow-hidden bg-white">
                  <SkeletonLoading width="100%" height="100%" className="rounded" />
                </div>
              </div>
            ))
          : characters.map((character) => (
              <div
                key={character.imageCharacterId}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedCharacter === character.imageCharacterId
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:border-gray-300'
                }
              ${transparentForm} ${hover}`}
                onClick={() => handleCharacterSelect(character.imageCharacterId)}
              >
                <div className="font-semibold">{character.name}</div>
                <div className="relative w-full aspect-video rounded overflow-hidden bg-white">
                  <Image
                    src={character.imageUrl}
                    alt={character.name}
                    fill
                    sizes="(max-width: 100%) 100vw, 100%"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
      </div>
      <Button text="참여하기" onClick={handleApply} disabled={!selectedCharacter} />
    </div>
  )
}

export default EventCharacterListPage
