import { useEffect, useState } from 'react'

interface TimerResult {
  isActive: boolean
  secondsLeft: number
}

/**
 * 주어진 시작 시간으로부터 특정 시간이 지난 후 활성화되는 타이머 훅
 * @param startTime ISO 8601 형식의 시작 시간 문자열 (예: "2025-04-21T10:23:45Z")
 * @param waitSeconds 대기 시간(초), 기본값 10
 * @returns {TimerResult} 활성화 여부와 남은 시간
 */
function useTimer(startTime: string | null, waitSeconds = 10): TimerResult {
  const [isActive, setIsActive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    // startTime이 없으면 타이머 동작하지 않음
    if (!startTime) {
      setIsActive(true)
      setSecondsLeft(0)
      return
    }

    const calculateTimeLeft = () => {
      const startDate = new Date(startTime)
      const expiryTime = new Date(startDate.getTime() + waitSeconds * 1000)
      const now = new Date()

      // 밀리초 단위까지 계산하여 올림
      const remainingMs = expiryTime.getTime() - now.getTime()
      const remaining = Math.ceil(remainingMs / 1000)

      if (remaining <= 0) {
        setIsActive(true)
        setSecondsLeft(0)
        return true // 타이머 종료 여부 반환
      }

      setIsActive(false)
      setSecondsLeft(remaining)
      return false
    }

    // 초기 계산
    const isExpired = calculateTimeLeft()

    // 만료되지 않은 경우에만 타이머 설정
    if (!isExpired) {
      const timer = setInterval(() => {
        const shouldClearTimer = calculateTimeLeft()
        if (shouldClearTimer) {
          clearInterval(timer)
        }
      }, 100) // 100ms 마다 업데이트

      return () => clearInterval(timer)
    }
  }, [startTime, waitSeconds])

  return {
    isActive,
    secondsLeft: Math.max(0, secondsLeft), // 음수 방지
  }
}

export default useTimer
