import { hover } from '@/styles/form'
import Image from 'next/image'

interface IconButtonProps {
  icon: string
}

const IconButton = ({ icon }: IconButtonProps) => {
  return (
    <div className={`p-1.5 rounded-md ${hover} w-fit cursor-pointer`}>
      <Image src={icon} alt={icon} width={14} height={14} />
    </div>
  )
}

export default IconButton
