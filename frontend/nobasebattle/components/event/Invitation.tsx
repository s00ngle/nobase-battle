import { transparentForm } from '@/styles/form'
import { hover } from '@/styles/form'
import Image from 'next/image'
import Button from '../common/Button'

interface InvitationProps {
  onClose: () => void
  onJoin: () => void
  onHide: () => void
}

const Invitation = ({ onClose, onJoin, onHide }: InvitationProps) => {
  return (
    <div className="flex flex-col absolute top-10 z-1 gap-2 w-[90%] max-w-[400px] left-1/2 -translate-x-1/2">
      <Image
        src="/close.svg"
        alt="close"
        width={24}
        height={24}
        className="absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
      />
      <Image
        src="/invitation.svg"
        alt="invitation"
        width={400}
        height={100}
        className="w-full h-auto"
      />
      <Button
        text="투기장 참가하기"
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 border-1 text-black cursor-pointer ${hover} ${transparentForm}`}
        onClick={onJoin}
      />
      <span
        className={`absolute -bottom-10 right-2 cursor-pointer ${transparentForm} ${hover}`}
        onClick={onHide}
      >
        오늘 하루 보지 않기
      </span>
    </div>
  )
}

export default Invitation
