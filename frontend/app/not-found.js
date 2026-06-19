'use client';

import Link from 'next/link';
import { FiHome } from 'react-icons/fi';
import config from './config';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
          <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full mb-6"></div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Sorry, page not found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-8">
            The page you are looking for may have been deleted, renamed, or temporarily unavailable
          </p>
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm md:text-base"
        >
          <FiHome className="w-5 h-5" />
          <span>Back to Home Page</span>
        </Link>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            If you think there is a problem, please contact 
            <a 
              href={`mailto:${config.email}`}
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

