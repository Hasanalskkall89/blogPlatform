import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'Blog Platform',
    template: '%s | Blog Platform',
  },
  description: 'A comprehensive blog platform for sharing stories and content. Built with modern technologies for a seamless experience.',
  keywords: ['blog', 'content', 'articles', 'stories', 'platform'],
  authors: [{ name: 'Blog Platform Team' }],
  openGraph: {
    title: 'Blog Platform',
    description: 'A comprehensive blog platform for sharing stories and content',
    type: 'website',
    locale: 'en_US',
    siteName: 'Blog Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Platform',
    description: 'A comprehensive blog platform for sharing stories and content',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

