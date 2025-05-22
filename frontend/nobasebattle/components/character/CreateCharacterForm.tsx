import Button from '@/components/common/Button'
import InputBox from '@/components/common/InputBox'
import { hover, transparentForm } from '@/styles/form'
import type { ReactNode } from 'react'

interface CreateCharacterFormProps {
  name: string
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  children?: ReactNode
}

const CreateCharacterForm = ({
  name,
  onNameChange,
  onSubmit,
  children,
}: CreateCharacterFormProps) => {
  return (
    <div
      className={`flex flex-col gap-4 w-full max-w-150 p-4 rounded-2xl ${transparentForm} ${hover}`}
    >
      <div className="text-xl">새 캐릭터 만들기</div>
      <InputBox
        label="캐릭터 이름(최대 20글자)"
        value={name}
        onChange={onNameChange}
        maxLength={20}
      />
      {children}
      <Button text="캐릭터 생성" border={true} onClick={onSubmit} />
    </div>
  )
}

export default CreateCharacterForm
