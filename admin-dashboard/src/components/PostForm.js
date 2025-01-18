'use client';

import { useState, useEffect } from 'react';
import MediaSelector from './MediaSelector';

export default function PostForm({ initialData, onSubmit }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update data when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategoryId(initialData.category_id || '');

      // Update media
      if (initialData.media && Array.isArray(initialData.media)) {
        const images = initialData.media
          .filter(m => m.media_type === 'image')
          .map(m => m.media_url);
        const videos = initialData.media
          .filter(m => m.media_type === 'video')
          .map(m => m.media_url);
        
        setSelectedImages(images);
        setSelectedVideos(videos);
      }
    }
  }, [initialData]);

  useEffect(() => {
    // Load categories
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean URLs to ensure correct format
      const cleanMediaUrl = (url, type) => {
        // Remove website URL if present
        let cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
        
        // Make sure path starts with /api
        if (!cleanUrl.startsWith('/api')) {
          cleanUrl = '/api' + cleanUrl;
        }
        
        // Ensure path follows correct structure
        if (type === 'image' && !cleanUrl.includes('/posts/uploads/images/')) {
          cleanUrl = cleanUrl.replace('/api/', '/api/posts/uploads/images/');
        } else if (type === 'video' && !cleanUrl.includes('/posts/uploads/videos/posts/')) {
          cleanUrl = cleanUrl.replace('/api/', '/api/posts/uploads/videos/posts/');
        }
        
        return cleanUrl;
      };

      const postData = {
        title,
        content,
        category_id: categoryId,
        media: [
          ...selectedImages.map(url => ({
            media_url: cleanMediaUrl(url, 'image'),
            media_type: 'image'
          })),
          ...selectedVideos.map(url => ({
            media_url: cleanMediaUrl(url, 'video'),
            media_type: 'video'
          }))
        ]
      };

      await onSubmit(postData);
    } catch (err) {
      console.error('Error submitting post:', err);
      setError(err.message || 'Error saving article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Article Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images
        </label>
        <MediaSelector
          type="images"
          selectedUrls={selectedImages}
          onSelect={setSelectedImages}
          maxSelections={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Videos
        </label>
        <MediaSelector
          type="videos"
          selectedUrls={selectedVideos}
          onSelect={setSelectedVideos}
          maxSelections={2}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Article' : 'Publish Article'}
        </button>
      </div>
    </form>
  );
}
