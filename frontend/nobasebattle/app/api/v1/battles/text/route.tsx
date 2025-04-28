import { NextResponse } from 'next/server'

interface RequestBody {
  characterId: string
  mode: string
  opponentId?: string
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json()
    console.log('Request Body:', body)
    return NextResponse.json({
      firstCharacter: {
        name: '불꽃의 마법사',
        prompt: '불꽃을 잘 다룸',
      },
      secondCharacter: {
        name: '물의 전사',
        prompt: '물을 잘 다룸',
      },
      battleLog:
        '불꽃의 마법사와 어둠의 암살자의 치열한 대결이 시작되었다! 불꽃의 마법사는 화염 폭풍을 소환하여 전장을 뜨겁게 달구었다. 어둠의 암살자는 그림자에 몸을 숨겨 기습을 시도했지만, 불꽃의 마법사의 화염 방벽에 막혔다. 불꽃의 마법사는 불사조를 소환해 강력한 일격을 가했고, 어둠의 암살자는 더 이상 저항할 수 없었다. 결국 불꽃의 마법사가 승리했다!',
      result: 1,
    })
  } catch (error) {
    console.error('Error occurred:', error)
    return NextResponse.json(
      { message: '데이터 처리 중 오류 발생' },
      {
        status: 500,
      },
    )
  }
}
