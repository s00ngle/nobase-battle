import { type BadgeColorKey, badgeColors } from '@/types/BadgeColors'

interface BadgeProps {
  text: string
  bgColor?: BadgeColorKey
}

const Badge = ({ text, bgColor = 'gray' }: BadgeProps) => {
  const colorClass = badgeColors[bgColor]

  return (
    <div className={`px-2 py-1 rounded-full whitespace-nowrap text-white ${colorClass}`}>
      {text}
    </div>
  )
}

export default Badge
