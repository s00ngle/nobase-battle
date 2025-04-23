import { hover, transparentForm } from '@/styles/form'
import IconButton from '../common/IconButton'

interface CharacterItemProps {
  nickname: string
  description: string
  onClick?: () => void
}

const CharacterItem = ({ nickname, description, onClick }: CharacterItemProps) => {
  return (
    <div
      className={`flex flex-col gap-3 w-full p-3 rounded-2xl cursor-pointer ${transparentForm} ${hover}`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div className="text-xl">{nickname}</div>
        <div className="flex gap-2">
          <IconButton icon="pen.svg" />
          <IconButton icon="delete.svg" />
        </div>
      </div>
      <div>{description}</div>
    </div>
  )
}

export default CharacterItem
