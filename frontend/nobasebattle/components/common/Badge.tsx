'use client'
import Image from 'next/image'
import { useState } from 'react'

interface BadgeProps {
  text: string
  imageUrl: string
  size?: number
}

const Badge = ({ text, imageUrl = '/favicon.png', size = 40 }: BadgeProps) => {
  const [isTextVisible, setIsTextVisible] = useState(false)

  return (
    <div
      className="relative"
      onClick={() => setIsTextVisible(!isTextVisible)}
      onMouseEnter={() => setIsTextVisible(true)}
      onMouseLeave={() => setIsTextVisible(false)}
    >
      <div
        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md transition-opacity duration-200 whitespace-nowrap ${isTextVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
      </div>
      <Image src={imageUrl} alt={text} width={size} height={size} />
    </div>
  )
}

export default Badge
