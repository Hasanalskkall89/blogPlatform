'use client';

import { useState, useEffect } from 'react';
import { HiPhotograph, HiVideoCamera, HiX } from 'react-icons/hi';

export default function MediaSelector({ onSelect, selectedUrls = [], maxSelections = 5, type = 'images' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
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
      setFiles(data.files);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const handleSelect = (url) => {
    if (selectedUrls.includes(url)) {
      onSelect(selectedUrls.filter(selectedUrl => selectedUrl !== url));
    } else if (selectedUrls.length < maxSelections) {
      onSelect([...selectedUrls, url]);
    } else {
      alert(`You can select up to ${maxSelections} files`);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (selectedUrls.length + files.length > maxSelections) {
      alert(`You can select up to ${maxSelections} files`);
      return;
    }

    const newFiles = Array.from(files);
    onSelect([...selectedUrls, ...newFiles]);
  };

  return (
    <div className="relative">
      {/* Upload files button */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {type === 'images' ? (
            <HiPhotograph className="h-5 w-5" />
          ) : (
            <HiVideoCamera className="h-5 w-5" />
          )}
          Choose from Library
        </button>

        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="file"
            multiple
            accept={type === 'images' ? 'image/*' : 'video/*'}
            onChange={handleFileUpload}
            className="hidden"
          />
          {type === 'images' ? (
            <HiPhotograph className="h-5 w-5" />
          ) : (
            <HiVideoCamera className="h-5 w-5" />
          )}
          Upload new {type === 'images' ? 'images' : 'videos'}
        </label>
      </div>

      {/* Media selection window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            {/* Dark overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Window content */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  Select {type === 'images' ? 'Images' : 'Videos'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <HiX className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelect(file.url)}
                      className={`relative cursor-pointer group ${
                        selectedUrls.includes(file.url)
                          ? 'ring-2 ring-indigo-600'
                          : ''
                      }`}
                    >
                      {type === 'images' ? (
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={file.url}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      
                      {/* Selection effect */}
                      <div
                        className={`absolute inset-0 bg-black ${
                          selectedUrls.includes(file.url)
                            ? 'bg-opacity-50'
                            : 'bg-opacity-0 group-hover:bg-opacity-25'
                        } transition-opacity rounded-lg flex items-center justify-center`}
                      >
                        {selectedUrls.includes(file.url) && (
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display selected files */}
      {selectedUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {selectedUrls.map((file, index) => (
            <div key={index} className="relative">
              {file instanceof File ? (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={file}
                    alt="Selected media"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => handleSelect(file)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
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
