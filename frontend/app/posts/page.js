'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const themeColors = colors[theme];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        setError('Error fetching posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 ${themeColors.background}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 text-center ${themeColors.text}`}>
          Posts
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className={`${themeColors.secondary} rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105`}
            >
              {post.media && post.media[0] && (
                <div className="relative h-48">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.media[0].media_url}`}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className={`text-xl font-semibold mb-2 ${themeColors.text}`}>
                  {post.title}
                </h2>
                <p className={`mb-4 line-clamp-3 ${themeColors.textLight}`}>
                  {post.content}
                </p>
                <div className="flex justify-between items-center">
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Read More
                  </Link>
                  <span className={`text-sm ${themeColors.textLight}`}>
                    {new Date(post.created_at).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
