import { IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
})

export const metadata = {
  title: 'Admin Dashboard - blog',
  description: 'Admin Dashboard for blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ibmPlexSansArabic.className}>
        {children}
      </body>
    </html>
  )
}
