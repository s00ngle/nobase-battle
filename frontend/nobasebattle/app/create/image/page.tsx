'use client'

import CreateCharacterForm from '@/components/character/CreateCharacterForm'
import PaintingCanvas from '@/components/common/PaintingCanvas'
import { useState } from 'react'

const CreatePage = () => {
  const [name, setName] = useState<string>('')

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleCreate = () => {
    alert(`캐릭터 이름 : ${name}`)
  }

  return (
    <CreateCharacterForm name={name} onNameChange={nameHandler} onSubmit={handleCreate}>
      <PaintingCanvas />
    </CreateCharacterForm>
  )
}

export default CreatePage
