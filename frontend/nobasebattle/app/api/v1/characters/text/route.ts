import type { ApiResponse, TextCharacter } from '@/app/types/character'
import { NextResponse } from 'next/server'

const mockData: TextCharacter[] = [
  {
    name: '김선명',
    prompt: '원내동 CU 야외 벤치 수호자',
    wins: 0,
    losses: 0,
    draws: 0,
    eloScore: 0,
    createAt: '2025-04-23T15:04:59.243',
    updateAt: '2025-04-23T15:04:59.243',
    winRate: 0.0,
    textCharacterId: '1',
  },
  {
    name: '이해수',
    prompt: '관저 95 이해솔 동생',
    wins: 0,
    losses: 0,
    draws: 0,
    eloScore: 0,
    createAt: '2025-04-23T15:04:59.243',
    updateAt: '2025-04-23T15:04:59.243',
    winRate: 0.0,
    textCharacterId: '3',
  },
  {
    name: '김찬우',
    prompt: '청량중 이니에스타',
    wins: 0,
    losses: 0,
    draws: 0,
    eloScore: 0,
    createAt: '2025-04-23T15:04:59.243',
    updateAt: '2025-04-23T15:04:59.243',
    winRate: 0.0,
    textCharacterId: '4',
  },
  {
    name: '상승규',
    prompt: '만년중 급식차 라이더',
    wins: 0,
    losses: 0,
    draws: 0,
    eloScore: 0,
    createAt: '2025-04-23T15:04:59.243',
    updateAt: '2025-04-23T15:04:59.243',
    winRate: 0.0,
    textCharacterId: '5',
  },
]

export async function GET() {
  try {
    const response: ApiResponse<TextCharacter[]> = {
      status: 200,
      data: mockData,
      success: true,
      timeStamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching text characters:', error)
    return NextResponse.json(
      {
        status: 500,
        data: [],
        success: false,
        timeStamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
