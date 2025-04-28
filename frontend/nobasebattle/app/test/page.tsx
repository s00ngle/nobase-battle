import CharacterInfo from '@/components/character/CharacterInfo'
import CharacterItem from '@/components/character/CharacterItem'
import RankingItems from '@/components/ranking/RankingItem'
import { characterData } from '@/data/characterInfo'

const TestPage = () => {
  const data = characterData
  return (
    <div className="flex flex-col gap-4 w-full max-w-150">
      <CharacterInfo
        character={<CharacterItem nickname={data.data.name} description={data.data.prompt} />}
        data={data.data}
      />
      <RankingItems rank={1} characterName="테스트" username="테스트" eloScore={1000} />
    </div>
  )
}

export default TestPage
