'use client';

import Link from 'next/link';
import { useTheme } from './context/ThemeContext';
import { colors } from './theme/colors';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <div className={`min-h-screen ${themeColors.background} flex items-center justify-center p-4`}>
      <div className={`max-w-xl w-full ${themeColors.cardBackground} rounded-2xl shadow-xl p-6 md:p-8 text-center`}>
        <div className="mb-6">
          <h1 className={`text-6xl md:text-8xl font-bold ${themeColors.text} mb-4`}>404</h1>
          <div className={`w-16 h-1 bg-blue-500 mx-auto rounded-full mb-6`}></div>
          <h2 className={`text-xl md:text-2xl font-semibold ${themeColors.text} mb-2`}>
            Page Not Found
          </h2>
          <p className={`${themeColors.secondaryText} text-sm md:text-base mb-8`}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <Link 
          href="/" 
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm md:text-base`}
        >
          <FiHome className="w-5 h-5" />
          <span>Return to Home Page</span>
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className={`${themeColors.secondaryText} text-sm`}>
            If you believe there is an issue, please contact 
            <a 
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              className="text-blue-500 hover:underline mx-1"
            >
              Support Team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
