import { transparentForm } from '@/styles/form'
import Button from './Button'

interface CreateCharacterFormProps {
  name: string
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  children: React.ReactNode
}

const CreateCharacterForm: React.FC<CreateCharacterFormProps> = ({
  name,
  onNameChange,
  onSubmit,
  children,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          캐릭터 이름
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onNameChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${transparentForm}`}
          placeholder="캐릭터 이름을 입력하세요"
          required
        />
      </div>
      {children}
      <Button text="캐릭터 생성하기" type="submit" />
    </form>
  )
}

export default CreateCharacterForm
