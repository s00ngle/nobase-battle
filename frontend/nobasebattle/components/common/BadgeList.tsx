import { transparentForm } from '@/styles/form'
import type { BadgeType } from '@/types/Badge'
import Badge from './Badge'

interface BadgeListProps {
  badges?: BadgeType[]
}

const BadgeList = ({ badges }: BadgeListProps) => {
  return (
    <div className={`flex gap-3 p-3 rounded-2xl w-full max-w-150 flex-wrap ${transparentForm}`}>
      {badges?.map((badge) => {
        return <Badge text={badge.text} bgColor={badge.bgColor} key={badge.text} />
      })}
    </div>
  )
}

export default BadgeList
