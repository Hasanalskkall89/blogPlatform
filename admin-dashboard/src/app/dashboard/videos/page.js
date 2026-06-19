'use client';

import { useState, useEffect } from 'react';
import VideoForm from '@/components/VideoForm';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import Loader from '@/components/Loader';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuth();

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`${API_URL}/videos/standalone-videos`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const handleCreateVideo = async (videoData) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/videos/standalone-videos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create video');
      }
      await fetchVideos();
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error creating video:', err);
      throw err;
    }
  };

  const handleUpdateVideo = async (videoData) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/videos/standalone-videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update video');
      }
      await fetchVideos();
      setIsFormOpen(false);
      setEditingVideo(null);
    } catch (err) {
      console.error('Error updating video:', err);
      throw err;
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    try {
      const response = await fetchWithAuth(`${API_URL}/videos/standalone-videos/${videoId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete video');
      await fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
      alert(err.message || 'Error deleting video');
    }
  };

  const getVideoUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `${API_URL.replace('/api', '')}${url}`;
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
        <button onClick={() => fetchVideos()} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Manage Videos</h1>
        <button
          onClick={() => { setEditingVideo(null); setIsFormOpen(true); }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all"
        >
          <FiPlus className="w-4 h-4" />
          Add New Video
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">No videos yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all">
              <div className="aspect-video">
                <video src={getVideoUrl(video.video_url)} className="object-cover w-full h-full" controls />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{video.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{video.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => { setEditingVideo(video); setIsFormOpen(true); }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h3>
            </div>
            <div className="px-4 sm:px-6 py-4">
              <VideoForm
                initialData={editingVideo}
                onSubmit={editingVideo ? handleUpdateVideo : handleCreateVideo}
                onCancel={() => { setIsFormOpen(false); setEditingVideo(null); }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

