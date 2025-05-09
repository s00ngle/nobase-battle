'use client'

import type { IEventResponse } from '@/app/types/Event'
import Button from '@/components/common/Button'
import EventTimer from '@/components/event/EventTimer'
import RankingList from '@/components/ranking/RankingList'
import { type IRankingResponse, getEventRanking, getLatestEvent } from '@/utils/event'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const EventPage = () => {
  const router = useRouter()
  const [eventData, setEventData] = useState<IEventResponse | null>(null)
  const [rankingData, setRankingData] = useState<IRankingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventResponse, rankingResponse] = await Promise.all([
          getLatestEvent(),
          getEventRanking(),
        ])
        setEventData(eventResponse)
        setRankingData(rankingResponse)
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const isEventStarted =
    eventData?.data.startTime && new Date(eventData.data.startTime) <= new Date()
  const isEventEnded = eventData?.data.endTime && new Date(eventData.data.endTime) < new Date()

  return (
    <div className="w-full max-w-150 flex flex-col items-center gap-6">
      <EventTimer eventData={eventData} isLoading={isLoading} />

      {isEventStarted && !isEventEnded && (
        <Button text="도전하기" onClick={() => router.push('/event/list')} />
      )}
      <div className="text-2xl font-bold">&lt;{eventData?.data.text}&gt; 랭킹 현황</div>
      <RankingList
        rankingData={
          rankingData || {
            status: 200,
            data: [],
            success: true,
            timeStamp: new Date().toISOString(),
          }
        }
        rankingType="image"
        canPractice={false}
      />
    </div>
  )
}

export default EventPage
