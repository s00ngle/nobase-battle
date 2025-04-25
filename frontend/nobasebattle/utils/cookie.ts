interface CookieOptions {
  path?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  maxAge?: number
}

export const setCookie = (name: string, value: string, options?: CookieOptions): Promise<void> => {
  return new Promise((resolve) => {
    const {
      path = '/',
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'strict',
      maxAge,
    } = options || {}

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    if (path) cookieString += `; path=${path}`
    if (secure) cookieString += '; secure'
    if (sameSite) cookieString += `; samesite=${sameSite}`
    if (maxAge) cookieString += `; max-age=${maxAge}`

    document.cookie = cookieString

    // 쿠키가 실제로 설정되었는지 확인
    const checkCookie = () => {
      if (getCookie(name) === value) {
        resolve()
      } else {
        setTimeout(checkCookie, 10)
      }
    }

    checkCookie()
  })
}

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map((c) => c.trim())
    if (cookieName === encodeURIComponent(name)) {
      return decodeURIComponent(cookieValue)
    }
  }
  return null
}

export const deleteCookie = (name: string, path = '/') => {
  document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
