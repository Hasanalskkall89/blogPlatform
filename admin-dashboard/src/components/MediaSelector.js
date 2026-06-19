'use client';

import { useState, useEffect } from 'react';
import { HiPhotograph, HiVideoCamera, HiX, HiUpload, HiCheck } from 'react-icons/hi';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

export default function MediaSelector({ onSelect, selectedUrls = [], maxSelections = 5, type = 'images' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuth();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithAuth(`${API_URL}/media/list/${type}/`);
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

  useEffect(() => {
    if (isOpen) fetchFiles();
  }, [isOpen]);

  const handleSelect = (url) => {
    if (selectedUrls.includes(url)) {
      onSelect(selectedUrls.filter(u => u !== url));
    } else if (selectedUrls.length < maxSelections) {
      onSelect([...selectedUrls, url]);
    }
  };

  const handleFileUpload = async (event) => {
    const uploadFiles = event.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(uploadFiles)) {
        const formData = new FormData();
        formData.append('file', file);
        if (file.type.startsWith('video/')) {
          formData.append('videoType', 'post');
        }

        const response = await fetchWithAuth(`${API_URL}/media/upload/`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload file');

        const data = await response.json();
        if (data.success && data.file) {
          const cleanUrl = data.file.url.replace(/^https?:\/\/[^\/]+/, '');
          if (selectedUrls.length < maxSelections) {
            onSelect([...selectedUrls, cleanUrl]);
          }
        }
      }
      if (isOpen) fetchFiles();
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeItem = (url) => {
    onSelect(selectedUrls.filter(u => u !== url));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm transition-colors"
        >
          {type === 'images' ? <HiPhotograph className="h-4 w-4" /> : <HiVideoCamera className="h-4 w-4" />}
          Select from Library
        </button>

        <label className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer text-sm transition-colors">
          <input
            type="file"
            multiple
            accept={type === 'images' ? 'image/*' : 'video/*'}
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <HiUpload className="h-4 w-4" />
          {uploading ? 'Uploading...' : `Upload ${type === 'images' ? 'Images' : 'Videos'}`}
        </label>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Select {type === 'images' ? 'Images' : 'Videos'}
                </h3>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HiX className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No files found
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
                  {files.map((file, index) => {
                    const isSelected = selectedUrls.includes(file.url);
                    return (
                      <div
                        key={index}
                        onClick={() => handleSelect(file.url)}
                        className={`relative cursor-pointer group rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected ? 'border-indigo-500 shadow-md' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {type === 'images' ? (
                          <img src={file.url} alt={file.filename} className="w-full h-28 sm:h-32 object-cover" />
                        ) : (
                          <video src={file.url} className="w-full h-28 sm:h-32 object-cover" />
                        )}
                        <div className={`absolute inset-0 transition-opacity ${isSelected ? 'bg-indigo-600/30' : 'bg-black/0 group-hover:bg-black/20'}`}>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full">
                              <HiCheck className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Done ({selectedUrls.length}/{maxSelections})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected files preview */}
      {selectedUrls.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {selectedUrls.filter(url => typeof url === 'string').map((url, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
              {type === 'images' ? (
                <img src={url.startsWith('http') ? url : `${API_URL.replace('/api', '')}${url}`} alt="Selected" className="w-full h-24 sm:h-28 object-cover" />
              ) : (
                <video src={url.startsWith('http') ? url : `${API_URL.replace('/api', '')}${url}`} className="w-full h-24 sm:h-28 object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeItem(url)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
              >
                <HiX className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

