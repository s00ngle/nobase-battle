import { hover, transparentForm } from '@/styles/form'
import IconButton from '../common/IconButton'
import SkeletonLoading from '../common/SkeletonLoading'

export interface CharacterItemProps {
  nickname: string
  description: string
  onClick?: () => void
  isLoading?: boolean
}

const CharacterItem = ({
  nickname,
  description,
  onClick,
  isLoading = false,
}: CharacterItemProps) => {
  return (
    <div
      className={`flex flex-col gap-3 w-full p-3 rounded-2xl cursor-pointer ${transparentForm} ${hover}`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        {isLoading ? (
          <SkeletonLoading width="8rem" height="1.5rem" />
        ) : (
          <div className="text-xl">{nickname}</div>
        )}
        <div className="flex gap-2">
          <IconButton icon="pen.svg" />
          <IconButton icon="delete.svg" />
        </div>
      </div>
      {isLoading ? <SkeletonLoading width="12rem" height="1.5rem" /> : <div>{description}</div>}
    </div>
  )
}

export default CharacterItem
