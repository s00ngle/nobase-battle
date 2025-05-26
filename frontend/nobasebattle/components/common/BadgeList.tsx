import { transparentForm } from '@/styles/form'
import type { BadgeType } from '@/types/Badge'
import Badge from './Badge'

interface BadgeListProps {
  badges?: BadgeType[]
  size?: number
  isTransparent?: boolean
  isPadding?: boolean
  isRightAligned?: boolean
}

const BadgeList = ({
  badges,
  size = 40,
  isTransparent = true,
  isPadding = true,
  isRightAligned = false,
}: BadgeListProps) => {
  const isSingleBadge = badges?.length === 1
  const displayBadges = isRightAligned ? badges?.slice(-3) : badges

  return (
    <div
      className={`flex gap-3 ${isPadding ? 'p-3' : ''} rounded-2xl ${
        isSingleBadge ? 'justify-end' : 'w-full max-w-150'
      } ${isRightAligned ? 'justify-end' : 'justify-start'} ${isTransparent ? transparentForm : ''}`}
    >
      {displayBadges?.map((badge) => {
        return <Badge text={badge.text} imageUrl={badge.imageUrl} key={badge.text} size={size} />
      })}
    </div>
  )
}

export default BadgeList
