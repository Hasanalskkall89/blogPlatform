'use client';

import { useState, useEffect } from 'react';
import MediaSelector from './MediaSelector';

export default function VideoForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [selectedVideo, setSelectedVideo] = useState(initialData?.video_url ? [initialData.video_url] : []);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      if (initialData.video_url) {
        if (initialData.video_url.startsWith('http')) {
          setShowUrlInput(true);
          setVideoUrl(initialData.video_url);
        } else {
          setSelectedVideo([initialData.video_url]);
        }
      }
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!showUrlInput && !selectedVideo.length) {
      setError('Please select a video');
      setLoading(false);
      return;
    }

    if (showUrlInput && !videoUrl) {
      setError('Please enter a video URL');
      setLoading(false);
      return;
    }

    try {
      const finalVideoUrl = showUrlInput ? videoUrl : selectedVideo[0];
      console.log('Selected video:', finalVideoUrl);

      const videoData = {
        title,
        description,
        video_url: finalVideoUrl
      };

      console.log('Submitting video data:', videoData);
      await onSubmit(videoData);
      onCancel();
    } catch (err) {
      console.error('Error submitting video:', err);
      setError(err.message || 'Error saving video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="p-4 block text-sm font-medium text-gray-700 mb-2">
            Video
          </label>
          <div className="space-y-4">
            <div className="flex space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  !showUrlInput
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Choose from Library
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  showUrlInput
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                Add URL
              </button>
            </div>

            <div className="mt-1 sm:mt-0">
              {showUrlInput ? (
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md border-gray-300"
                  placeholder="Enter video URL"
                />
              ) : (
                <MediaSelector
                  type="videos"
                  selectedUrls={selectedVideo}
                  onSelect={setSelectedVideo}
                  maxSelections={1}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      <div className="mt-5 sm:mt-6 flex justify-end space-x-3 space-x-reverse">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
