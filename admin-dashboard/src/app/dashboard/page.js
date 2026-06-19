'use client';

import { useState, useEffect } from 'react';
import { HiNewspaper, HiVideoCamera, HiFolder } from 'react-icons/hi';
import Loader from '@/components/Loader';
import { API_URL } from '@/config';
import { useAuth } from '@/hooks/useAuth';

function getTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  return 'just now';
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    posts: { count: 0, latestPost: null },
    videos: { count: 0, latestVideo: null },
    categories: { count: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/stats`, {
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          throw new Error(data.message || 'An unknown error occurred');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Articles',
      value: stats.posts.count,
      icon: HiNewspaper,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Videos',
      value: stats.videos.count,
      icon: HiVideoCamera,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Categories',
      value: stats.categories.count,
      icon: HiFolder,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{card.value}</h3>
              </div>
              <div className={`${card.bgLight} p-3.5 rounded-2xl`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {stats.posts.latestPost && (
            <div className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl shrink-0">
                <HiNewspaper className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">New article added</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{getTimeAgo(stats.posts.latestPost)}</p>
              </div>
            </div>
          )}
          {stats.videos.latestVideo && (
            <div className="flex items-center gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-750 rounded-xl">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl shrink-0">
                <HiVideoCamera className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">New video added</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{getTimeAgo(stats.videos.latestVideo)}</p>
              </div>
            </div>
          )}
          {!stats.posts.latestPost && !stats.videos.latestVideo && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

