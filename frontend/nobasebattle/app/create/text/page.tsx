'use client'

import CreateCharacterForm from '@/components/character/CreateCharacterForm'
import TextArea from '@/components/common/TextArea'
import { createTextCharacter } from '@/utils/characters'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CreatePage = () => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const router = useRouter()
  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const descriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleCreate = async () => {
    try {
      await createTextCharacter({ name, prompt: description })
      alert('캐릭터 생성 완료')
      router.push('/')
    } catch (error) {
      console.error('캐릭터 생성 실패:', error)
      alert(error instanceof Error ? error.message : '캐릭터 생성 실패')
    }
  }

  return (
    <CreateCharacterForm name={name} onNameChange={nameHandler} onSubmit={handleCreate}>
      <TextArea label="캐릭터 설명" value={description} onChange={descriptionHandler} />
    </CreateCharacterForm>
  )
}

export default CreatePage
