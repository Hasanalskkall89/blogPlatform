'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FiChevronRight, FiChevronLeft, FiPlay } from 'react-icons/fi';
import { API_URL, BASE_URL } from './lib/api';
import { stripHtml } from './lib/utils';
import { HomeSkeleton } from './components/Skeleton';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/videos/standalone-videos`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/posts?limit=6`).then(r => r.json()).catch(() => []),
    ]).then(([videosData, postsData]) => {
      setVideos(videosData);
      setPosts(postsData);
      setLoading(false);
    });
  }, []);

  if (loading) return <HomeSkeleton />;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Blog Platform
          </h1>
          <p className="text-lg md:text-xl text-blue-100 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            A platform for sharing stories, articles, and multimedia content
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/posts"
              className="px-6 py-3 bg-white text-blue-700 rounded-full font-medium hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse Articles
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-full font-medium hover:bg-white/20 transition-colors"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Latest Videos
              </h2>
              <Link
                href="/videos"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="relative group">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation={{
                  prevEl: '.swiper-button-prev',
                  nextEl: '.swiper-button-next',
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="pb-4"
              >
                {videos.map(video => (
                  <SwiperSlide key={video.id}>
                    <Link
                      href={`/videos/${video.id}`}
                      className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-video group/video">
                        <video className="w-full h-full object-cover">
                          <source src={`${BASE_URL}${video.video_url}`} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover/video:bg-black/50 transition-colors">
                          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                            <FiPlay className="w-6 h-6 text-blue-600 mr-[-2px]" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className="mt-1.5 text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                            {video.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-700/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 -translate-x-5">
                <FiChevronLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
              <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-700/90 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-x-5">
                <FiChevronRight className="w-5 h-5 text-gray-800 dark:text-gray-200" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Articles Section */}
      <section className="py-12 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Latest Articles
            </h2>
            <Link
              href="/posts"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link href={`/posts/${post.id}`} key={post.id}>
                <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {post.media && post.media[0] && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={`${BASE_URL}${post.media[0].media_url}`}
                        alt={post.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      {post.category && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white backdrop-blur-sm">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug">{post.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm flex-grow">
                      {stripHtml(post.content || post.excerpt)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
