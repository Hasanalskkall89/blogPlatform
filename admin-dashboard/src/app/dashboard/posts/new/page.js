'use client';

import { useRouter } from 'next/navigation';
import PostForm from '@/components/PostForm';

export default function NewPost() {
  const router = useRouter();

  const handleSubmit = async (postData) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
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
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Article</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <PostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
