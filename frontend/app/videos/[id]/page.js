'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL, BASE_URL } from '../../lib/api';

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/videos/standalone-videos/${videoId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Video not found');
        }
        return res.json();
      })
      .then(data => {
        setVideo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-xl text-gray-800 dark:text-gray-100 mb-4">
          {error || 'Video not found'}
        </h1>
        <Link href="/videos" className="text-gray-800 dark:text-gray-100 hover:underline">
          Back to Videos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/videos" className="hover:text-blue-500 transition-colors">Videos</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{video.title}</span>
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-video">
            <video
              className="w-full h-full"
              controls
              autoPlay
            >
              <source src={`${BASE_URL}${video.video_url}`} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
          
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {video.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(video.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            {video.description && (
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {video.description}
              </p>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/videos"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Back to Videos
          </Link>
        </div>
      </div>
    </div>
  );
}
