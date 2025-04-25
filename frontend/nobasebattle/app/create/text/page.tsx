'use client'

import CreateCharacterForm from '@/components/character/CreateCharacterForm'
import TextArea from '@/components/common/TextArea'
import { useState } from 'react'

const CreatePage = () => {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const descriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleCreate = () => {
    alert(`캐릭터 이름 : ${name}\n캐릭터 설명 : ${description}`)
  }

  return (
    <CreateCharacterForm name={name} onNameChange={nameHandler} onSubmit={handleCreate}>
      <TextArea label="캐릭터 설명" value={description} onChange={descriptionHandler} />
    </CreateCharacterForm>
  )
}

export default CreatePage
