'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { API_URL, BASE_URL } from '../../lib/api';
import { stripHtml } from '../../lib/utils';

export default function CategoryPosts() {
  const params = useParams();
  const categoryId = params.id;
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch category info
        const categoryResponse = await fetch(`${API_URL}/categories/${categoryId}`);
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category data');
        }
        const categoryData = await categoryResponse.json();
        setCategory(categoryData);

        // Fetch articles in this category
        const postsResponse = await fetch(`${API_URL}/posts?category=${categoryId}`);
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch articles');
        }
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryData();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-800 dark:text-gray-100">
          <p>Error: {error}</p>
          <Link href="/categories" className="mt-4 text-blue-500 hover:underline block">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-xl text-gray-800 dark:text-gray-100 mb-4">Category not found</h1>
        <Link href="/categories" className="text-gray-800 dark:text-gray-100 hover:underline">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            href="/categories"
            className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
          >
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {category.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {post.media && post.media[0] && (
                <div className="relative h-48 w-full">
                  <Image
                    src={`${BASE_URL}${post.media[0].media_url}`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  {stripHtml(post.content)}
                </p>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(post.created_at).toLocaleDateString('en-US')}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center text-gray-800 dark:text-gray-100 mt-8">
            No articles in this category yet
          </div>
        )}
      </div>
    </div>
  );
}
