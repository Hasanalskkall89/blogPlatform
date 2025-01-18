'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function VideoPage() {
  const params = useParams();
  const videoId = params.id;
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/standalone-videos/${videoId}`)
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
      <div className={`min-h-screen ${themeColors.background} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className={`min-h-screen ${themeColors.background} flex items-center justify-center flex-col`}>
        <h1 className={`text-xl ${themeColors.text} mb-4`}>
          {error || 'Video not found'}
        </h1>
        <Link href="/videos" className={`${themeColors.text} hover:underline`}>
          Back to Videos
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeColors.background} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/videos"
            className={`${themeColors.text} hover:opacity-80 transition-opacity inline-flex items-center`}
          >
            ← Back to Videos
          </Link>
        </div>

        <div className={`${themeColors.cardBackground} rounded-lg shadow-lg overflow-hidden`}>
          <div className="aspect-video">
            <video
              className="w-full h-full"
              controls
              autoPlay
            >
              <source src={`${process.env.NEXT_PUBLIC_API_URL}${video.video_url}`} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>
          
          <div className="p-6">
            <h1 className={`text-2xl font-bold ${themeColors.text} mb-4`}>
              {video.title}
            </h1>
            {video.description && (
              <p className={`${themeColors.secondaryText} mb-4 whitespace-pre-wrap`}>
                {video.description}
              </p>
            )}
            <div className={`text-sm ${themeColors.secondaryText}`}>
              Published: {new Date(video.created_at).toLocaleDateString('en-US')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
