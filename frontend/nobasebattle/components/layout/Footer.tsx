'use client'

import { hover, transparentForm } from '@/styles/form'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface OptionProps {
  text: string
  link: string
}

const Option = ({ text, link }: OptionProps) => {
  return (
    <Link
      href={link}
      className={`w-25 h-15 flex justify-center items-center active:scale-80 transition-transform duration-200 ${hover}`}
    >
      {text}
    </Link>
  )
}

const OptionList = [
  { text: '홈', link: '/' },
  { text: '투기장', link: '/event' },
  { text: '랭킹', link: '/rank' },
  { text: '프로필', link: '/profile' },
]

const Footer = () => {
  const pathname = usePathname()

  if (pathname === '/register') {
    return null
  }

  return (
    <div
      className={`flex w-full justify-center fixed bottom-0 backdrop-blur-sm ${transparentForm}`}
    >
      {OptionList.map((option) => (
        <Option key={option.link} text={option.text} link={option.link} />
      ))}
    </div>
  )
}

export default Footer
