'use client'

import Button from '@/components/common/Button'
import InputBox from '@/components/common/InputBox'
import PaintingCanvas from '@/components/common/PaintingCanvas'
import { hover, transparentForm } from '@/styles/form'
import { useState } from 'react'

const CreatePage = () => {
  const [name, setName] = useState<string>('')
  // const [description, setDescription] = useState<string>('')

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleCreate = () => {
    alert(`캐릭터 이름 : ${name}`)
  }

  return (
    <div
      className={`flex flex-col gap-4 w-full max-w-150 p-4 rounded-2xl ${transparentForm} ${hover}`}
    >
      <div className="text-xl">새 캐릭터 만들기</div>
      <InputBox
        label="캐릭터 이름(최대 20글자)"
        value={name}
        onChange={nameHandler}
        maxLength={20}
      />
      <PaintingCanvas />
      <Button text="캐릭터 생성" border={true} onClick={handleCreate} />
    </div>
  )
}

export default CreatePage
