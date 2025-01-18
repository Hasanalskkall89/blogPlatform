'use client';

import { useState, useEffect } from 'react';
import VideoForm from '@/components/VideoForm';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/standalone-videos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message || 'Error fetching videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCreateVideo = async (videoData) => {
    try {
      console.log('Creating video with data:', videoData);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/standalone-videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: videoData.title,
          description: videoData.description,
          video_url: videoData.video_url
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create video');
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
      console.log('Updating video with data:', videoData);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/standalone-videos/${editingVideo.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: videoData.title,
          description: videoData.description,
          video_url: videoData.video_url
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update video');
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
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/standalone-videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete video');
      }

      await fetchVideos();
    } catch (err) {
      console.error('Error deleting video:', err);
      alert(err.message || 'Error deleting video');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Standalone Videos</h1>
        <button
          onClick={() => {
            setEditingVideo(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add New Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          // Standalone video comes in format /api/videos/standalone/1.mp4
          const displayVideoUrl = video.video_url.startsWith('http') 
            ? video.video_url 
            : `${process.env.NEXT_PUBLIC_MEDIA_URL}${video.video_url}`;
            
          return (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="aspect-w-16 aspect-h-9">
                <video 
                  src={displayVideoUrl}
                  className="object-cover w-full h-full"
                  controls
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingVideo(video);
                      setIsFormOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="border-b border-gray-200">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingVideo ? 'Update Video' : 'Add New Video'}
                </h3>
              </div>
            </div>
            <div className="px-6 py-4">
              <VideoForm
                initialData={editingVideo}
                onSubmit={editingVideo ? handleUpdateVideo : handleCreateVideo}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingVideo(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
