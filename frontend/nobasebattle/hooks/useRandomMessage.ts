import { useEffect, useState } from 'react'

/**
 * 주어진 메시지 배열에서 랜덤하게 메시지를 선택하여 주기적으로 변경하는 훅
 * @param messages 메시지 배열
 * @param interval 메시지 변경 간격 (ms), 기본값 2000ms
 * @returns 현재 선택된 메시지
 */
function useRandomMessage(messages: string[], interval = 2000): string {
  const [currentMessage, setCurrentMessage] = useState(messages[0])

  useEffect(() => {
    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length)
      setCurrentMessage(messages[randomIndex])
    }, interval)

    return () => clearInterval(timer)
  }, [messages, interval])

  return currentMessage
}

export default useRandomMessage
