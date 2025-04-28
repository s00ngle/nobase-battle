import Image from 'next/image'

interface BadgeProps {
  text: string
  imageUrl: string
}

const Badge = ({ text, imageUrl = '/favicon.png' }: BadgeProps) => {
  return (
    <div className="relative group">
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
      </div>
      <Image src={imageUrl} alt={text} width={40} height={40} />
    </div>
  )
}

export default Badge
