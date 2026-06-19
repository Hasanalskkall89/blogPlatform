'use client';

import { useState, useEffect } from 'react';
import { HiUpload, HiTrash, HiClipboardCopy, HiPhotograph, HiVideoCamera, HiCheck } from 'react-icons/hi';
import Loader from '@/components/Loader';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function MediaLibrary() {
  const [activeTab, setActiveTab] = useState('images');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showVideoTypeModal, setShowVideoTypeModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const { fetchWithAuth } = useAuth();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithAuth(`${API_URL}/media/list/${activeTab}/`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, [activeTab]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type.startsWith('video/')) {
      setSelectedFile(file);
      setShowVideoTypeModal(true);
      return;
    }
    await uploadFile(file);
    event.target.value = '';
  };

  const uploadFile = async (file, videoType = null) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      if (videoType) formData.append('videoType', videoType);

      const response = await fetchWithAuth(`${API_URL}/media/upload/`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      await fetchFiles();
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message);
    } finally {
      setUploading(false);
      setShowVideoTypeModal(false);
      setSelectedFile(null);
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      const response = await fetchWithAuth(`${API_URL}/media/${filename}/`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete file');
      await fetchFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message);
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const tabs = [
    { key: 'images', label: 'Images', icon: HiPhotograph },
    { key: 'videos', label: 'Videos', icon: HiVideoCamera },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Media Library</h1>
        <label className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 text-sm font-medium shadow-lg shadow-indigo-500/25 transition-all">
          <HiUpload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-3">{activeTab === 'images' ? '🖼️' : '🎬'}</div>
          No {activeTab === 'images' ? 'images' : 'videos'} yet
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {files.map((file, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all">
              <div className="relative">
                {activeTab === 'images' ? (
                  <img src={file.url} alt={file.filename} className="w-full h-32 sm:h-40 object-cover" />
                ) : (
                  <video src={file.url} className="w-full h-32 sm:h-40 object-cover" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="p-2 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === file.url ? <HiCheck className="h-4 w-4 text-green-600" /> : <HiClipboardCopy className="h-4 w-4 text-gray-700 dark:text-gray-300" />}
                  </button>
                  <button
                    onClick={() => handleDelete(file.filename)}
                    className="p-2 bg-white dark:bg-gray-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete"
                  >
                    <HiTrash className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{file.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video type modal */}
      {showVideoTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 sm:p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Video Type</h3>
            <div className="space-y-3">
              <button
                onClick={() => uploadFile(selectedFile, 'post')}
                className="w-full p-4 text-right border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">Post Video</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Will be linked to an article</div>
              </button>
              <button
                onClick={() => uploadFile(selectedFile, 'standalone')}
                className="w-full p-4 text-right border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white">Standalone Video</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Will appear in standalone videos section</div>
              </button>
            </div>
            <button
              onClick={() => { setShowVideoTypeModal(false); setSelectedFile(null); }}
              className="mt-4 w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

