import Link from 'next/link'

const TestPage = () => {
  return (
    <div>
      <div className="text-5xl">Test Page</div>
      <Link href={'/'}>MainPage</Link>
    </div>
  )
}

export default TestPage
