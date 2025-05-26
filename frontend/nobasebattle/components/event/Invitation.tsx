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
    <div className="flex flex-col absolute top-10 z-1 gap-4 w-[90%] max-w-[400px] left-1/2 -translate-x-1/2">
      <div className="relative w-full aspect-[2/3]">
        <Image
          src="/close.svg"
          alt="close"
          width={24}
          height={24}
          className="absolute top-8 right-4 cursor-pointer z-10"
          onClick={onClose}
        />
        <Image
          src="/invitation.svg"
          alt="invitation"
          fill
          priority
          style={{ objectFit: 'contain' }}
        />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%]">
          <Button
            text="투기장 참가하기"
            className={`w-full border-1 text-black cursor-pointer ${hover} ${transparentForm}`}
            onClick={onJoin}
          />
        </div>
      </div>
      <div className="flex justify-end -mt-4">
        <span className={`cursor-pointer ${transparentForm} ${hover}`} onClick={onHide}>
          오늘 하루 보지 않기
        </span>
      </div>
    </div>
  )
}

export default Invitation
