'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { colors } from './theme/colors';

const inter = Inter({ subsets: ['latin'] });

function RootLayoutContent({ children }) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <body className={`${inter.className} min-h-screen flex flex-col ${themeColors.background}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-20">
        {children}
      </main>
      <Footer />
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <ThemeProvider>
        <RootLayoutContent>{children}</RootLayoutContent>
      </ThemeProvider>
    </html>
  );
}

