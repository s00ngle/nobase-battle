import BadgeList from '@/components/common/BadgeList'
import type { BadgeType } from '@/types/Badge'

const TestPage = () => {
  const badgeList: BadgeType[] = [
    { text: '제1회 토너먼트 우승자', bgColor: 'accent' },
    { text: '무근본상1', bgColor: 'red' },
    { text: '무근본상2', bgColor: 'yellow' },
    { text: '제2회 토너먼트 우승자', bgColor: 'green' },
  ]

  return (
    <>
      <div className="text-5xl">Test Page</div>

      <BadgeList badges={badgeList} />
    </>
  )
}

export default TestPage
