import { transparentForm } from "@/styles/form";
import { hover } from "@/styles/form";
import Image from "next/image";
import Button from "../common/Button";

interface InvitationProps {
  onClose: () => void;
  onJoin: () => void;
  onHide: () => void;
}

const Invitation = ({ onClose, onJoin, onHide }: InvitationProps) => {
  return (
    <div className="flex flex-col absolute z-1 gap-2 min-w-100">
      <Image
        src="/close.svg"
        alt="close"
        width={24}
        height={24}
        className="absolute top-4 right-4 cursor-pointer"
        onClick={onClose}
      />
      <Image src="/invitation.svg" alt="invitation" width={400} height={100} />
      <Button
        text="투기장 참가하기"
        className={`absolute bottom-4 left-30 border-1 text-black cursor-pointer ${hover} ${transparentForm}`}
        onClick={onJoin}
      />
      <span
        className={`absolute -bottom-10 right-2 cursor-pointer ${transparentForm} ${hover}`}
        onClick={onHide}
      >
        오늘 하루 보지 않기
      </span>
    </div>
  );
};

export default Invitation;
