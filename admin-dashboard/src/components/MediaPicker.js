'use client';

import { useState, useEffect } from 'react';
import { HiUpload, HiX, HiCheck } from 'react-icons/hi';

export default function MediaPicker({ onSelect, selectedUrls = [], multiple = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

  const fetchMedia = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError(err.message || 'Error fetching media');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    setUploadingFiles(prev => [...prev, ...selectedFiles.map(file => ({
      file,
      progress: 0,
      error: null
    }))]);

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const data = await response.json();
        setFiles(prev => [...prev, data]);
      } catch (err) {
        console.error('Error uploading file:', err);
        setUploadingFiles(prev => prev.map(item => 
          item.file === file ? { ...item, error: err.message } : item
        ));
      } finally {
        setUploadingFiles(prev => prev.filter(item => item.file !== file));
      }
    }
  };

  const handleSelect = (file) => {
    if (!multiple) {
      onSelect([file.url]);
      setIsOpen(false);
      return;
    }

    if (selectedUrls.includes(file.url)) {
      onSelect(selectedUrls.filter(url => url !== file.url));
    } else {
      onSelect([...selectedUrls, file.url]);
    }
  };

  if (!isOpen) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Choose from Media Library
        </button>

        {selectedUrls.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Selected ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onSelect(selectedUrls.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <HiX className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Media Library</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          <label className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer inline-flex items-center gap-2">
            <HiUpload className="h-5 w-5" />
            <span>Upload New File</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {uploadingFiles.length > 0 && (
          <div className="px-4 pb-4">
            <div className="space-y-2">
              {uploadingFiles.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.file.name}</div>
                    {item.error && (
                      <div className="text-sm text-red-600">{item.error}</div>
                    )}
                  </div>
                  <div className="w-1/4 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  onClick={() => handleSelect(file)}
                  className={`relative cursor-pointer group rounded-lg overflow-hidden ${
                    selectedUrls.includes(file.url) ? 'ring-2 ring-indigo-600' : ''
                  }`}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                    {selectedUrls.includes(file.url) && (
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full">
                        <HiCheck className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
