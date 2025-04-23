import ThemeToggleButton from '@/components/common/ThemeToggleButton'
import { hover, transparentForm } from '@/styles/form'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <ThemeToggleButton />

      <div>무근본 배틀</div>
      <div
        className={`flex flex-col gap-2 w-full max-w-150 p-4 rounded-2xl ${transparentForm} ${hover}`}
      >
        <div>test</div>
        <div className={`p-4 rounded-xl ${transparentForm} ${hover}`}>asdf</div>
      </div>
    </div>
  )
}
