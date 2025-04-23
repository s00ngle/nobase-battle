
import RankingItems from '@/components/ranking/RankingItem'
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
        <RankingItems rank={1} characterName='탱크보이' username='전두환' eloScore={2000}/>
      </div>
    </>
  )
}
