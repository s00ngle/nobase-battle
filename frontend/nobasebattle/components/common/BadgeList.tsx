import { transparentForm } from '@/styles/form'
import type { BadgeType } from '@/types/Badge'
import Badge from './Badge'

interface BadgeListProps {
  badges?: BadgeType[]
  size?: number
  isTransparent?: boolean
  isPadding?: boolean
}

const BadgeList = ({
  badges,
  size = 40,
  isTransparent = true,
  isPadding = true,
}: BadgeListProps) => {
  return (
    <div
      className={`flex gap-3 ${isPadding ? 'p-3' : ''} rounded-2xl w-full max-w-150 flex-wrap ${isTransparent ? transparentForm : ''}`}
    >
      {badges?.map((badge) => {
        return <Badge text={badge.text} imageUrl={badge.imageUrl} key={badge.text} size={size} />
      })}
    </div>
  )
}

export default BadgeList
