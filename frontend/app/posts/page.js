'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL, BASE_URL } from '../lib/api';
import { stripHtml } from '../lib/utils';
import { PostCardSkeleton } from '../components/Skeleton';
import Pagination from '../components/Pagination';

const POSTS_PER_PAGE = 9;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (response.ok) {
        setPosts(data);
      } else {
        setError('Error fetching articles');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(start, start + POSTS_PER_PAGE);
  }, [posts, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <PostCardSkeleton key={i} />)}
          </div>
        </div>
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Articles
          </h1>
          {posts.length > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * POSTS_PER_PAGE) + 1}-{Math.min(currentPage * POSTS_PER_PAGE, posts.length)} of {posts.length} articles
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {post.media && post.media[0] && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={`${BASE_URL}${post.media[0].media_url}`}
                      alt={post.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    {post.category && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-sm">
                        {post.category.name}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm flex-grow">
                    {stripHtml(post.content)}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
