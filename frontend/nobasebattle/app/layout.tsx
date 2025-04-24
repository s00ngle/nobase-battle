import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: '무근본 배틀',
  description: '나만의 캐릭터를 만들어서 승리해 보세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={
          'flex flex-col items-center bg-white transition-colors duration-300 px-6 py-20 min-w-[330px] min-h-svh dark:bg-gray-700 text-gray-800 dark:text-gray-200 antialiased'
        }
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
