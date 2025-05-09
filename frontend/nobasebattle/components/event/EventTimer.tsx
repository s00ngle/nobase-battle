'use client'

import type { IEventResponse } from '@/app/types/Event'
import { transparentForm } from '@/styles/form'
import { useEffect, useState } from 'react'

interface EventTimerProps {
  eventData: IEventResponse | null
  isLoading: boolean
}

const EventTimer = ({ eventData, isLoading }: EventTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (!eventData) return

    const endTime = new Date(eventData.data.endTime).getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = endTime - now

      if (distance < 0) {
        setTimeLeft('이벤트가 종료되었습니다.')
        return
      }

      // const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`)
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [eventData])

  if (isLoading) {
    return <div className="text-2xl font-bold">로딩 중...</div>
  }

  if (!eventData) {
    return <div className="text-2xl font-bold">이벤트 정보를 불러오는데 실패했습니다.</div>
  }

  return (
    <div className={`flex flex-col items-center gap-2 p-3 ${transparentForm}`}>
      <div className="text-2xl font-bold">이벤트 종료까지</div>
      <div className="text-2xl sm:text-4xl font-bold">{timeLeft}</div>
    </div>
  )
}

export default EventTimer
