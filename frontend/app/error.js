'use client';

import { useTheme } from './context/ThemeContext';
import { colors } from './theme/colors';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiRefreshCcw, FiHome, FiArrowRight } from 'react-icons/fi';

export default function Error({
  error,
  reset,
}) {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const router = useRouter();

  return (
    <div className={`min-h-screen ${themeColors.background} flex items-center justify-center p-4`}>
      <div className={`max-w-xl w-full ${themeColors.cardBackground} rounded-2xl shadow-xl p-6 md:p-8 text-center`}>
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src="/error.png"
              alt="Error"
              width={128}
              height={128}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold ${themeColors.text} mb-4`}>
            Sorry, an unexpected error occurred
          </h1>
          <p className={`${themeColors.secondaryText} text-sm md:text-base mb-8`}>
            {error?.message || 'An error occurred while loading the page. Please try again.'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors duration-300 text-sm md:text-base w-full md:w-auto"
          >
            <FiArrowRight className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm md:text-base w-full md:w-auto"
          >
            <FiRefreshCcw className="w-5 h-5" />
            <span>Try Again</span>
          </button>

          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300 text-sm md:text-base w-full md:w-auto"
          >
            <FiHome className="w-5 h-5" />
            <span>Home Page</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className={`${themeColors.secondaryText} text-sm`}>
            If the problem persists, please contact 
            <a 
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
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
