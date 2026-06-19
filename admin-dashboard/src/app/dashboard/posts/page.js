'use client';

import { useState, useEffect } from 'react';
import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import Link from 'next/link';
import Loader from '@/components/Loader';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/posts`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Error fetching articles');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const response = await fetchWithAuth(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete article');
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Error deleting article');
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Articles</h1>
        <Link
          href="/dashboard/posts/new"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all"
        >
          <HiPlus className="h-4 w-4" />
          Add New Article
        </Link>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2 line-clamp-1">{post.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-lg">{post.category_name || 'Uncategorized'}</span>
                <span>{new Date(post.created_at).toLocaleDateString('en-US')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/dashboard/posts/${post.id}/edit`} className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg">
                  <HiPencil className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <HiTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-750">
            <tr>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Title</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Publish Date</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg">{post.category_name || 'Uncategorized'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString('en-US')}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/posts/${post.id}/edit`} className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                      <HiPencil className="h-4.5 w-4.5" />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <HiTrash className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No articles yet
        </div>
      )}
    </div>
  );
}
