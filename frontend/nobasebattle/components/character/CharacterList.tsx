import { transparentForm } from '@/styles/form'
import { useState } from 'react'
import CharacterItem from './CharacterItem'

type Character = {
  nickname: string
  description: string
}

const data: Character[] = [
  { nickname: '김선명', description: '원내동 CU 야외 벤치 수호자' },
  { nickname: '김용순', description: '죽동 자택 경비원 지망생' },
  { nickname: '이해수', description: '관저 95 이해솔 동생' },
  { nickname: '김찬우', description: '청량중 이니에스타' },
  { nickname: '상승규', description: '만년중 급식차 라이더' },
  { nickname: '신동운', description: '집에 가고싶다' },
]

const CharacterList = () => {
  const [character] = useState<Character[] | null>(data)

  return (
    <div className={`flex flex-col gap-3 w-full flex-1 rounded-2xl p-4 ${transparentForm}`}>
      <div className="text-xl">캐릭터 목록</div>
      {!character && <div className="text-2xl">캐릭터가 아직 없어요</div>}
      {character && (
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {character.map((item) => {
            return (
              <CharacterItem
                key={item.nickname + item.description}
                nickname={item.nickname}
                description={item.description}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CharacterList
