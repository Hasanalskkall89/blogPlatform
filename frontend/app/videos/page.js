'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FiPlay } from 'react-icons/fi';
import { API_URL, BASE_URL } from '../lib/api';
import { VideoCardSkeleton } from '../components/Skeleton';
import Pagination from '../components/Pagination';

const VIDEOS_PER_PAGE = 9;

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/videos/standalone-videos`)
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching videos:', err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
  const paginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * VIDEOS_PER_PAGE;
    return videos.slice(start, start + VIDEOS_PER_PAGE);
  }, [videos, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="h-9 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <VideoCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Videos
          </h1>
          {videos.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * VIDEOS_PER_PAGE) + 1}-{Math.min(currentPage * VIDEOS_PER_PAGE, videos.length)} of {videos.length} videos
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedVideos.map(video => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-video group">
                <video className="w-full h-full object-cover">
                  <source src={`${BASE_URL}${video.video_url}`} type="video/mp4" />
                </video>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FiPlay className="w-6 h-6 text-blue-600 mr-[-2px]" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                  {video.title}
                </h2>
                {video.description && (
                  <p className="mt-1.5 text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                    {video.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(video.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {videos.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12 py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">No videos available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
