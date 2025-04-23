import InputBox from '@/components/common/InputBox'
import { hover, transparentForm } from '@/styles/form'

export default function Home() {
  return (
    <>
      <div>무근본 배틀</div>
      <div
        className={`flex flex-col gap-2 w-full max-w-150 p-4 rounded-2xl ${transparentForm} ${hover}`}
      >
        <div>test</div>
        <div className={`p-4 rounded-xl ${transparentForm} ${hover}`}>asdf</div>
        <InputBox text='이메일'/>
        <InputBox text='비밀번호'/>
      </div>
    </>
  )
}
