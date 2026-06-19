'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '../lib/api';
import { stripHtml } from '../lib/utils';
import { CategoryCardSkeleton } from '../components/Skeleton';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch(`${API_URL}/categories`);
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // Fetch posts for all categories in parallel instead of one by one
        const postsResults = await Promise.all(
          categoriesData.map(cat =>
            fetch(`${API_URL}/posts?category=${cat.id}`)
              .then(res => res.json())
              .catch(() => [])
          )
        );

        const postsMap = {};
        categoriesData.forEach((cat, i) => {
          postsMap[cat.id] = postsResults[i];
        });
        setCategoryPosts(postsMap);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <CategoryCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 text-center">
        Categories
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(category => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {category.name}
              </h2>
              
              <div className="space-y-4">
                {categoryPosts[category.id]?.slice(0, 3).map(post => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="block transition-all duration-200"
                  >
                    <div className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                        {post.title}
                      </h3>
                      <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                        {stripHtml(post.content)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {categoryPosts[category.id]?.length > 3 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/categories/${category.id}`}
                    className="inline-block px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    View more
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
