'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const PostForm = dynamic(() => import('@/components/PostForm'), { ssr: false, loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-700 rounded-xl" /> });
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function NewPost() {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();

  const handleSubmit = async (postData) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create article');
      }

      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Add New Article</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <PostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

