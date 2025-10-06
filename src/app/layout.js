import { Inter } from 'next/font/google'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LearnCraft AI - AI-Powered Lesson Planning',
  description: 'Where Every Lesson Comes Alive - Create engaging, comprehensive lesson plans in seconds with AI',
  keywords: 'education, lesson planning, AI, teaching, curriculum',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}