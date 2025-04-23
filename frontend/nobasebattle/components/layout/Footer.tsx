import { hover, transparentForm } from '@/styles/form'
import Link from 'next/link'

interface OptionProps {
  text: string
  link: string
}

const Option = ({ text, link }: OptionProps) => {
  return (
    <Link href={link} className={`w-25 h-15 flex justify-center items-center ${hover}`}>
      {text}
    </Link>
  )
}

const OptionList = [
  { text: '홈', link: '/' },
  { text: '투기장', link: '/event' },
  { text: '랭킹', link: '/rank' },
  { text: '프로필', link: '/profile' },
  { text: '테스트', link: '/test' },
]

const Footer = () => {
  return (
    <div className={`flex w-full justify-center fixed bottom-0 ${transparentForm}`}>
      {OptionList.map((option) => (
        <Option key={option.link} text={option.text} link={option.link} />
      ))}
    </div>
  )
}

export default Footer
