'use client';

import { useState, useEffect } from 'react';
import { HiUpload, HiTrash, HiPhotograph, HiVideoCamera } from 'react-icons/hi';
import Loader from '@/components/Loader';

export default function MediaLibrary() {
  const [activeTab, setActiveTab] = useState('images');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('image'); // 'image', 'post-video', 'standalone-video'

  // Fetch files by type
  const fetchFiles = async (type) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/list/${type}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setShowUploadModal(true);
    
    // Set default type based on file type
    if (file.type.startsWith('image/')) {
      setUploadType('image');
    } else if (file.type.startsWith('video/')) {
      setUploadType('post-video');
    }
  };

  // Upload new file
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null); // Reset error state

      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Add video type if file is video
      if (selectedFile.type.startsWith('video/')) {
        const videoType = uploadType === 'standalone-video' ? 'standalone' : 'post';
        formData.append('videoType', videoType);
        console.log('Uploading video with type:', videoType);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/upload/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type will be set automatically
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload file');
      }

      // Close modal and reset state
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadType('image');

      // Update file list
      fetchFiles(activeTab);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Delete file
  const handleDelete = async (filename) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/${filename}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      // Update file list
      fetchFiles(activeTab);
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message);
    }
  };

  // Copy file URL
  const copyFileUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert('URL copied successfully');
  };

  useEffect(() => {
    fetchFiles(activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
        <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <span className="flex items-center gap-2">
            <HiUpload className="h-5 w-5" />
            Upload new file
          </span>
          <input
            type="file"
            className="hidden"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* File type selection modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select file type</h2>
            
            {selectedFile?.type.startsWith('image/') ? (
              <p className="mb-4">Image will be uploaded to images folder</p>
            ) : (
              <div className="space-y-4 mb-4">
                <p className="font-medium">Select video type:</p>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={uploadType === 'post-video'}
                    onChange={() => setUploadType('post-video')}
                  />
                  Video associated with post
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={uploadType === 'standalone-video'}
                    onChange={() => setUploadType('standalone-video')}
                  />
                  Standalone video
                </label>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload file'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              activeTab === 'images'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <HiPhotograph className="h-5 w-5" />
            Images
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 ${
              activeTab === 'videos'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <HiVideoCamera className="h-5 w-5" />
            Videos
          </button>
        </nav>
      </div>

      {/* File list */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type === 'image' ? (
                // Display images
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                // Display videos
                <video
                  src={file.url}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              
              {/* Control buttons */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyFileUrl(file.url)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="Copy URL"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(file.filename)}
                  className="p-2 bg-white text-red-600 rounded-full hover:bg-gray-100"
                  title="Delete"
                >
                  <HiTrash className="h-5 w-5" />
                </button>
              </div>

              {/* File information */}
              <div className="mt-2 text-sm text-gray-500">
                <div className="truncate">{file.filename}</div>
                <div>{Math.round(file.size / 1024)} KB</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
