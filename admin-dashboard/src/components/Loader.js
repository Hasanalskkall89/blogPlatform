'use client';

export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 border-2 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
          <div className="absolute top-0 left-0 w-10 h-10 border-2 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    </div>
  );
}

