'use client';

import { useState, useEffect } from 'react';
import MediaSelector from './MediaSelector';
import { API_URL } from '@/config';

export default function VideoForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMediaLibrary, setUseMediaLibrary] = useState(true);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setVideoUrl(initialData.video_url || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!title.trim()) throw new Error('Please enter video title');
      if (!videoUrl.trim()) throw new Error('Please select or enter video URL');

      let cleanUrl = videoUrl;
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = cleanUrl.replace(/^https?:\/\/[^\/]+/, '');
        if (!cleanUrl.startsWith('/api')) cleanUrl = '/api' + cleanUrl;
      }

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        video_url: cleanUrl,
      });
    } catch (err) {
      console.error('Error submitting video:', err);
      setError(err.message || 'Error saving video');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_URL.replace('/api', '')}${url}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Video Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Video Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video URL</label>
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() => setUseMediaLibrary(true)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              useMediaLibrary ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            From Media Library
          </button>
          <button
            type="button"
            onClick={() => setUseMediaLibrary(false)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              !useMediaLibrary ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            Direct URL
          </button>
        </div>

        {useMediaLibrary ? (
          <MediaSelector type="videos" selectedUrls={videoUrl ? [videoUrl] : []} onSelect={(urls) => setVideoUrl(urls[0] || '')} maxSelections={1} />
        ) : (
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            dir="ltr"
          />
        )}
      </div>

      {videoUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Preview</label>
          <video src={getPreviewUrl(videoUrl)} controls className="w-full rounded-xl" />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all font-medium"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}

