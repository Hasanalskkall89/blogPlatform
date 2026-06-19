'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
const PostForm = dynamic(() => import('@/components/PostForm'), { ssr: false, loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-700 rounded-xl" /> });
import Loader from '@/components/Loader';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function EditPost() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Error fetching article');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (postData) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update article');
      }
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return <div className="text-red-500 dark:text-red-400 text-center p-6">{error}</div>;
  }

  if (!post) {
    return <div className="text-gray-500 dark:text-gray-400 text-center p-6">Article not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Edit Article</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <PostForm initialData={post} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

