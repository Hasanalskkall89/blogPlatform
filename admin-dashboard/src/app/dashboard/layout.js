'use client';

import { useState, useEffect } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">EP</span>
          </div>
          <span className="font-semibold text-gray-800 dark:text-white text-sm">Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          <HiMenuAlt3 className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="lg:mr-64 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
