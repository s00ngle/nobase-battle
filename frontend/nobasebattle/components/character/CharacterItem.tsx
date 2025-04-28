'use client'

import { hover, transparentForm } from '@/styles/form'
import Image from 'next/image'
import IconButton from '../common/IconButton'
import SkeletonLoading from '../common/SkeletonLoading'

export interface CharacterItemProps {
  nickname: string
  description?: string
  imageUrl?: string
  onClick?: () => void
  isLoading?: boolean
  imageSize?: 'sm' | 'lg'
  onDelete?: () => void
  onEdit?: () => void
}

const CharacterItem = ({
  nickname,
  description,
  imageUrl,
  onClick,
  isLoading = false,
  imageSize = 'lg',
  onDelete,
  onEdit,
}: CharacterItemProps) => {
  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation()
    onEdit?.()
  }
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation()
    onDelete?.()
  }

  return (
    <div
      className={`flex flex-col gap-3 w-full p-3 rounded-2xl cursor-pointer hover:scale-98 transition-transform duration-200 ${transparentForm} ${hover}`}
      onClick={onClick}
    >
      <div className="flex justify-between">
        {isLoading ? (
          <SkeletonLoading width="8rem" height="1.5rem" className="rounded-md" />
        ) : (
          <div className="text-xl">{nickname}</div>
        )}
        <div className="flex gap-2">
          <IconButton icon="pen.svg" onClick={handleEdit} />
          <IconButton icon="delete.svg" onClick={handleDelete} />
        </div>
      </div>
      {imageUrl && (
        <div className="flex justify-center">
          <div
            className={`bg-gray-200 rounded-md relative aspect-video ${
              imageSize === 'sm' ? 'w-80' : 'w-full'
            }`}
          >
            <Image src={imageUrl} alt="character" fill className="object-contain" priority />
          </div>
        </div>
      )}
      {description &&
        (isLoading ? (
          <SkeletonLoading width="12rem" height="1.5rem" className="rounded-md" />
        ) : (
          <div>{description}</div>
        ))}
    </div>
  )
}

export default CharacterItem
