'use client'

import CreateCharacterForm from '@/components/character/CreateCharacterForm'
import PaintingCanvas from '@/components/common/PaintingCanvas'
import { createImageCharacter } from '@/utils/characters'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

const CreatePage = () => {
  const [name, setName] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleCreate = async () => {
    if (!name) {
      alert('캐릭터 이름을 입력해주세요.')
      return
    }

    if (!canvasRef.current) {
      alert('그림을 그려주세요.')
      return
    }

    try {
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

      // 이미지 캐릭터 생성 API 호출
      await createImageCharacter({
        name,
        image: blob,
      })

      alert('캐릭터 생성 완료')
      router.push('/')
    } catch (error) {
      console.error('캐릭터 생성 실패:', error)
      alert(error instanceof Error ? error.message : '캐릭터 생성에 실패했습니다.')
    }
  }

  return (
    <CreateCharacterForm name={name} onNameChange={nameHandler} onSubmit={handleCreate}>
      <PaintingCanvas canvasRef={canvasRef} />
    </CreateCharacterForm>
  )
}

export default CreatePage
