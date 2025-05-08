import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // 쿠키에서 토큰 가져오기
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      console.error('No token found in cookies')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching image from:', url)
    const response = await fetch(url, {
      headers: {
        Accept: 'image/*',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText)
      return NextResponse.json(
        {
          error: 'Failed to fetch image',
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status },
      )
    }

    const blob = await response.blob()
    const headers = new Headers()
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png')
    headers.set('Cache-Control', 'public, max-age=31536000')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return new NextResponse(blob, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
