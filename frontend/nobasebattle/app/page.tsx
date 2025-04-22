import ThemeToggleButton from '@/components/ThemeToggleButton'
import { transparentForm } from '@/styles/form'

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <ThemeToggleButton />

      <div>무근본 배틀</div>
      <div className={`w-80 h-80 rounded-xl ${transparentForm}`}>
        <div>test</div>
        <div className={`w-20 h-20 rounded-xl ${transparentForm}`}>asdf</div>
      </div>
    </div>
  )
}
