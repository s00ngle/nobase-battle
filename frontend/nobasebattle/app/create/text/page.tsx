'use client'

import Button from '@/components/common/Button'
import InputBox from '@/components/common/InputBox'
import TextArea from '@/components/common/TextArea'
import { hover, transparentForm } from '@/styles/form'
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
      <TextArea label="캐릭터 설명" value={description} onChange={descriptionHandler} />
      <Button text="캐릭터 생성" border={true} onClick={handleCreate} />
    </div>
  )
}

export default CreatePage
