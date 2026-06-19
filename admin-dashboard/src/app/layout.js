import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
})

export const metadata = {
  title: 'Dashboard - Blog Platform',
  description: 'Admin Dashboard for Blog Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={ibmPlexSansArabic.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
