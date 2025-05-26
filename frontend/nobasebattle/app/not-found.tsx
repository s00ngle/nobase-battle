'use client'

import { useEffect } from 'react'

const NotFound = () => {
  useEffect(() => {
    window.location.href = '/'
  }, [])

  return (
    <div className="flex flex-col flex-1 items-center justify-center text-5xl">
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p className="text-lg">페이지를 찾을 수 없습니다.</p>
    </div>
  )
}

export default NotFound
