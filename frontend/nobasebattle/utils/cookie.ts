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
      secure = false,
      sameSite = 'lax',
      maxAge = 7 * 24 * 60 * 60,
    } = options || {}

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    if (path) cookieString += `; path=${path}`
    if (secure) cookieString += '; secure'
    if (sameSite) cookieString += `; samesite=${sameSite}`
    if (maxAge) cookieString += `; max-age=${maxAge}`

    try {
      document.cookie = cookieString
    } catch (error) {
      console.error('쿠키 설정 실패:', error)
    }

    const checkCookie = () => {
      const currentValue = getCookie(name)
      if (currentValue === value) {
        console.log('쿠키 설정 성공:', name)
        resolve()
      } else {
        console.log('쿠키 설정 재시도 중:', name)
        try {
          document.cookie = cookieString
        } catch (error) {
          console.error('쿠키 재설정 실패:', error)
        }
        setTimeout(checkCookie, 100)
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

export const deleteCookie = (name: string, path = '/'): Promise<void> => {
  return new Promise((resolve) => {
    const cookieString = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    
    try {
      document.cookie = cookieString
    } catch (error) {
      console.error('쿠키 삭제 실패:', error)
    }

    const checkCookieDeleted = () => {
      const currentValue = getCookie(name)
      if (!currentValue) {
        console.log('쿠키 삭제 성공:', name)
        resolve()
      } else {
        console.log('쿠키 삭제 재시도 중:', name)
        try {
          document.cookie = cookieString
        } catch (error) {
          console.error('쿠키 재삭제 실패:', error)
        }
        setTimeout(checkCookieDeleted, 100)
      }
    }

    checkCookieDeleted()
  })
}
