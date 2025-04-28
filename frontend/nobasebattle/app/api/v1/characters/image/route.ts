import type { ApiResponse, ImageCharacter } from '@/app/types/character'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const mockData: ImageCharacter[] = [
      {
        imageCharacterId: '1',
        name: '캐릭터1',
        imageUrl: 'https://example.com/image1.jpg',
        wins: 10,
        losses: 5,
        draws: 2,
        totalBattles: 17,
        winRate: 0.588,
        eloScore: 1500,
        rank: 1,
        badges: [
          { text: 'badge1', imageUrl: '/favicon.png' },
          { text: 'badge2', imageUrl: '/favicon.png' },
        ],
        createdAt: '2025-04-23T15:04:59.243',
        updatedAt: '2025-04-23T15:04:59.243',
      },
    ]

    const response: ApiResponse<ImageCharacter[]> = {
      status: 200,
      data: mockData,
      success: true,
      timeStamp: new Date().toISOString(),
    }
    return NextResponse.json(response)
  } catch (error: unknown) {
    console.error('Error fetching image characters:', error)
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
