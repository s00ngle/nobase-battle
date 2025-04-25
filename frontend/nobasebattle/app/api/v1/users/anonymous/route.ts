import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // TODO: 실제 익명 로그인 로직 구현
    // 예시 응답
    return NextResponse.json({
      success: true,
      data: {
        accessToken: 'anonymous_access_token',
        role: 'ANONYMOUS',
      },
    })
  } catch (error) {
    console.error('익명 로그인 처리 중 오류 발생:', error)
    return NextResponse.json(
      { success: false, message: '익명 로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
