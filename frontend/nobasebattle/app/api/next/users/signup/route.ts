import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 },
      )
    }

    // TODO: 실제 회원가입 로직 구현
    // 예시 응답
    return NextResponse.json({
      success: true,
      data: {
        accessToken: 'example_access_token',
        role: 'USER',
      },
    })
  } catch (error) {
    console.error('회원가입 처리 중 오류 발생:', error)
    return NextResponse.json(
      { success: false, message: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    )
  }
}
