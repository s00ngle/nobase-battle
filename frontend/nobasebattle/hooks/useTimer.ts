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

    // 시작 시간과 만료 시간 계산
    const startDate = new Date(startTime)
    const expiryTime = new Date(startDate.getTime() + waitSeconds * 1000)
    const now = new Date()

    // 이미 만료된 경우 즉시 활성화
    if (expiryTime <= now) {
      setIsActive(true)
      setSecondsLeft(0)
      return
    }

    // 남은 시간 계산
    const initialSecondsLeft = Math.floor((expiryTime.getTime() - now.getTime()) / 1000)
    setSecondsLeft(initialSecondsLeft)
    setIsActive(false)

    // 타이머 설정
    const timer = setInterval(() => {
      const currentTime = new Date()
      const remaining = Math.floor((expiryTime.getTime() - currentTime.getTime()) / 1000)

      if (remaining <= 0) {
        setIsActive(true)
        setSecondsLeft(0)
        clearInterval(timer)
      } else {
        setSecondsLeft(remaining)
      }
    }, 1000)

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer)
  }, [startTime, waitSeconds])

  return { isActive, secondsLeft }
}

export default useTimer
