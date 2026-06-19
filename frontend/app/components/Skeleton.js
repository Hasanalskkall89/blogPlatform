'use client';

export function SkeletonBox({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      <SkeletonBox className="h-48 rounded-none" />
      <div className="p-5 flex flex-col flex-grow">
        <SkeletonBox className="h-5 w-3/4 mb-3" />
        <SkeletonBox className="h-4 w-full mb-2" />
        <SkeletonBox className="h-4 w-2/3 mb-4" />
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <SkeletonBox className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      <SkeletonBox className="aspect-video rounded-none" />
      <div className="p-4">
        <SkeletonBox className="h-5 w-3/4 mb-2" />
        <SkeletonBox className="h-4 w-full mb-2" />
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 mt-3">
          <SkeletonBox className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <SkeletonBox className="h-4 w-48 mb-6" />
      <SkeletonBox className="h-[400px] w-full mb-8 rounded-xl" />
      <SkeletonBox className="h-8 w-3/4 mb-4" />
      <div className="flex gap-3 mb-8">
        <SkeletonBox className="h-5 w-32" />
        <SkeletonBox className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-3">
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-5/6" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-4/5" />
        <SkeletonBox className="h-4 w-full" />
        <SkeletonBox className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-6">
      <SkeletonBox className="h-6 w-1/3 mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-3">
            <SkeletonBox className="h-5 w-3/4 mb-2" />
            <SkeletonBox className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <SkeletonBox className="h-[300px] md:h-[400px] rounded-none" />
      
      {/* Videos section skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <SkeletonBox className="h-7 w-40" />
          <SkeletonBox className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <VideoCardSkeleton key={i} />)}
        </div>
      </div>

      {/* Posts section skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <SkeletonBox className="h-7 w-32" />
          <SkeletonBox className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <PostCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
