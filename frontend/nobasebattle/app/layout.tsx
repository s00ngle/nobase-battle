import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: '무근본 배틀',
  description: '나만의 캐릭터를 만들어서 승리해 보세요.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon-apple.png',
  },
  openGraph: {
    title: '무근본 배틀 - 나만의 캐릭터를 만들어서 승리해 보세요.',
    description: '세계 최강! 프롬프팅 배틀',
    url: 'http://43.201.97.202/',
    images: [
      {
        url: 'http://43.201.97.202/openGraphThumbnail.png',
        width: 1200,
        height: 630,
        alt: '무근본 배틀',
      },
    ],
    siteName: '무근본 배틀',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={
          'flex flex-col items-center bg-white transition-colors duration-300 px-6 py-20 min-w-[330px] min-h-svh dark:bg-gray-700 text-gray-800 dark:text-gray-200 antialiased'
        }
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
