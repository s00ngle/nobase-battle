import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    console.log('Fetching image from:', url)

    // S3 URL인 경우 직접 가져오기
    if (url.includes('nobasebattle-s3.s3.ap-northeast-2.amazonaws.com')) {
      const response = await fetch(url)
      if (!response.ok) {
        console.error('Failed to fetch S3 image:', response.status, response.statusText)
        return NextResponse.json(
          {
            error: 'Failed to fetch S3 image',
            status: response.status,
            statusText: response.statusText,
          },
          { status: response.status },
        )
      }
      const blob = await response.blob()
      return new NextResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/png',
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // 다른 URL의 경우 백엔드 API를 통해 가져오기
    const backendUrl = `http://13.125.105.148:8080/api/v1/characters/image/proxy?url=${encodeURIComponent(url)}`
    const response = await fetch(backendUrl)

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
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
