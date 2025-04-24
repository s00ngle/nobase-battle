'use client'

import { hover, transparentForm } from '@/styles/form'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeToggleButton = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`w-10 h-10 rounded-full ${transparentForm} ${hover}`} />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`w-10 h-10 rounded-full ${transparentForm} ${hover} cursor-pointer`}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggleButton
