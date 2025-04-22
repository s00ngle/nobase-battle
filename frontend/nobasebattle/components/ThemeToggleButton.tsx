'use client'

import { transparentForm } from '@/styles/form'
import { useEffect, useState } from 'react'

export default function ThemeToggleButton() {
  // 1. 기본값 true(다크모드)
  const [darkMode, setDarkMode] = useState(true)

  // 2. 클라이언트에서 localStorage 값 적용
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme))
    }
  }, [])

  // 3. darkMode 상태가 바뀔 때마다 html class와 localStorage 동기화
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // 4. 토글 함수
  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`mb-6 p-2 rounded-full ${transparentForm} transition-all duration-1000 cursor-pointer`}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  )
}
