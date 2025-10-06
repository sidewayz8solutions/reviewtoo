import { Inter } from 'next/font/google'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ReviewToo - AI-Powered Lesson Planning',
  description: 'Create engaging, comprehensive lesson plans for K-12 students in seconds with AI',
  keywords: 'education, lesson planning, AI, teaching, curriculum, K-12',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}