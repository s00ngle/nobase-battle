'use client'

import { hover, transparentForm } from '@/styles/form'
import { useEffect, useState } from 'react'

function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

const ThemeToggleButton = () => {
  const [darkMode, setDarkMode] = useState(true)
  const hasMounted = useHasMounted()

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme))
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  if (!hasMounted) {
    // SSR 중에 하이드레이션 불일치를 방지하기 위해 빈 div 반환
    return <div className={`p-2 rounded-full ${transparentForm} ${hover}`} />
  }

  return (
    <button
      type="button"
      onClick={() => setDarkMode((prev) => !prev)}
      className={`w-10 h-10 rounded-full ${transparentForm} ${hover} cursor-pointer`}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggleButton
