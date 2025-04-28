import { hover } from '@/styles/form'
import Image from 'next/image'

interface IconButtonProps {
  icon: string
  onClick?: (event: React.MouseEvent) => void
  isDark?: boolean
}

const IconButton = ({ icon, onClick, isDark = false }: IconButtonProps) => {
  return (
    <div
      className={`p-1.5 rounded-md ${hover} w-fit cursor-pointer active:scale-90 transition-transform duration-200`}
      onClick={onClick}
    >
      <div className={`${isDark ? 'dark-icon' : 'light-icon'}`}>
        <Image src={`/${icon}`} alt={icon} width={14} height={14} />
      </div>
    </div>
  )
}

export default IconButton

// CSS 스타일을 global.css 또는 해당 컴포넌트의 CSS 모듈에 추가해야 합니다:
/*
.light-icon {
  filter: brightness(0) saturate(100%);
}

.dark-icon {
  filter: brightness(0) saturate(100%) invert(100%);
}
*/
