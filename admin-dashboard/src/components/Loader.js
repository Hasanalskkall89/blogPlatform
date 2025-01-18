'use client';

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative">
        <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-indigo-600 border-t-transparent shadow-md"></div>
        
        {/* Moving dots */}
        <div className="flex gap-1 mt-16">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
