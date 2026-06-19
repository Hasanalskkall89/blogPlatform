'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import MediaSelector from './MediaSelector';
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-700 rounded-xl" />,
});
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function PostForm({ initialData, onSubmit }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [categories, setCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imageInsertCallback, setImageInsertCallback] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setCategoryId(initialData.category_id || '');

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
    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/categories`);
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

  const handleImageInsert = useCallback((addImageFn) => {
    setImageInsertCallback(() => addImageFn);
    setShowImagePicker(true);
  }, []);

  const handleImageSelected = useCallback((urls) => {
    if (imageInsertCallback && urls.length > 0) {
      const lastUrl = urls[urls.length - 1];
      const fullUrl = lastUrl.startsWith('http') ? lastUrl : `${API_URL.replace('/api', '')}${lastUrl}`;
      imageInsertCallback(fullUrl);
    }
    setShowImagePicker(false);
    setImageInsertCallback(null);
  }, [imageInsertCallback]);

  const cleanMediaUrl = (url, type) => {
    if (typeof url !== 'string') return '';
    let cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
    if (!cleanUrl.startsWith('/api')) {
      cleanUrl = '/api' + cleanUrl;
    }
    if (type === 'image' && !cleanUrl.includes('/posts/uploads/images/')) {
      cleanUrl = cleanUrl.replace('/api/', '/api/posts/uploads/images/');
    } else if (type === 'video' && !cleanUrl.includes('/posts/uploads/videos/posts/')) {
      cleanUrl = cleanUrl.replace('/api/', '/api/posts/uploads/videos/posts/');
    }
    return cleanUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData = {
        title,
        content,
        category_id: categoryId,
        media: [
          ...selectedImages.filter(url => typeof url === 'string').map(url => ({
            media_url: cleanMediaUrl(url, 'image'),
            media_type: 'image'
          })),
          ...selectedVideos.filter(url => typeof url === 'string').map(url => ({
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
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Article Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder="Enter article title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Article Content
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          onImageInsert={handleImageInsert}
        />
      </div>

      {/* Image picker modal for editor inline images */}
      {showImagePicker && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Select an image to insert</h3>
            <MediaSelector
              type="images"
              selectedUrls={[]}
              onSelect={handleImageSelected}
              maxSelections={1}
            />
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => { setShowImagePicker(false); setImageInsertCallback(null); }}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Article Images (Attachments)
        </label>
        <MediaSelector
          type="images"
          selectedUrls={selectedImages}
          onSelect={setSelectedImages}
          maxSelections={5}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Videos
        </label>
        <MediaSelector
          type="videos"
          selectedUrls={selectedVideos}
          onSelect={setSelectedVideos}
          maxSelections={2}
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200 font-medium"
        >
          {loading ? 'Saving...' : initialData ? 'Update Article' : 'Publish Article'}
        </button>
      </div>
    </form>
  );
}

