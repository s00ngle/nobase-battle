import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // 요청 URL 가져오기
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')

  // 토큰이 없는 경우 /register로 리다이렉트 (단, /register 페이지는 제외)
  if (!token && pathname !== '/register') {
    return NextResponse.redirect(new URL('/register', request.url))
  }

  // 토큰이 있는 경우 /register 접근 차단
  if (token && pathname === '/register') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// 미들웨어가 적용될 경로 지정
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
