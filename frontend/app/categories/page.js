'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import Link from 'next/link';
import Image from 'next/image';

export default function Categories() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const [categories, setCategories] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        // Fetch posts for each category
        data.forEach(category => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${category.id}`)
            .then(res => res.json())
            .then(posts => {
              setCategoryPosts(prev => ({
                ...prev,
                [category.id]: posts
              }));
            })
            .catch(err => console.error(`Error fetching posts for category ${category.id}:`, err));
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
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
      <h1 className={`text-3xl font-bold mb-8 ${themeColors.text} text-center`}>
        Categories
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map(category => (
          <div
            key={category.id}
            className={`${themeColors.cardBackground} rounded-lg shadow-lg overflow-hidden`}
          >
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-4 ${themeColors.text}`}>
                {category.name}
              </h2>
              
              <div className="space-y-4">
                {categoryPosts[category.id]?.slice(0, 3).map(post => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="block transition-all duration-200"
                  >
                    <div className={`p-3 rounded-lg ${themeColors.hoverBackground}`}>
                      <h3 className={`text-lg font-medium ${themeColors.text}`}>
                        {post.title}
                      </h3>
                      <p className={`text-sm mt-2 ${themeColors.secondaryText} line-clamp-2`}>
                        {post.content}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {categoryPosts[category.id]?.length > 3 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/categories/${category.id}`}
                    className={`inline-block px-4 py-2 rounded-md ${themeColors.button} ${themeColors.buttonText} hover:opacity-90 transition-opacity`}
                  >
                    View More
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
