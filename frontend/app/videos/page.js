'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import Link from 'next/link';

export default function Videos() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/standalone-videos`)
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

  if (loading) {
    return (
      <div className={`min-h-screen ${themeColors.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeColors.background} p-6`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${themeColors.text} text-center`}>
          Videos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className={`${themeColors.cardBackground} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow`}
            >
              <div className="relative aspect-video">
                <video
                  className="w-full h-full object-cover"
                >
                  <source src={`${process.env.NEXT_PUBLIC_API_URL}${video.video_url}`} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
                <div className={`absolute inset-0 flex items-center justify-center ${themeColors.overlay} opacity-0 hover:opacity-100 transition-opacity`}>
                  <span className={`${themeColors.text} text-lg font-semibold`}>
                    Play Video
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className={`text-xl font-semibold ${themeColors.text}`}>
                  {video.title}
                </h2>
                {video.description && (
                  <p className={`mt-2 ${themeColors.secondaryText} line-clamp-2`}>
                    {video.description}
                  </p>
                )}
                <div className={`mt-2 text-sm ${themeColors.secondaryText}`}>
                  {new Date(video.created_at).toLocaleDateString('ar-EG')}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {videos.length === 0 && (
          <div className={`text-center ${themeColors.text} mt-8`}>
            No videos available
          </div>
        )}
      </div>
    </div>
  );
}
