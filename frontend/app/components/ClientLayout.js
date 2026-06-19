'use client';

import { ThemeProvider } from '../context/ThemeContext';
import Header from './Header';
import Footer from './Footer';

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
