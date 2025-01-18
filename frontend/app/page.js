'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from './context/ThemeContext';
import { colors } from './theme/colors';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

export default function Home() {
  const { theme } = useTheme();
  const themeColors = colors[theme];
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch standalone videos
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/standalone-videos`)
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(err => console.error('Error fetching videos:', err));

    // Fetch latest posts
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=6`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Error fetching posts:', err));

    // Fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  return (
    <main className={`min-h-screen ${themeColors.background}`}>
      {/* Videos Section */}
      {videos.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold ${themeColors.text}`}>
                Latest Videos
              </h2>
              <Link
                href="/videos"
                className={`${themeColors.text} hover:opacity-80 transition-opacity text-sm`}
              >
                View All Videos
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
                  640: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="pb-4"
              >
                {videos.map(video => (
                  <SwiperSlide key={video.id}>
                    <Link
                      href={`/videos/${video.id}`}
                      className={`block ${themeColors.cardBackground} rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow`}
                    >
                      <div className="relative aspect-video">
                        <video className="w-full h-full object-cover">
                          <source src={`${process.env.NEXT_PUBLIC_API_URL}${video.video_url}`} type="video/mp4" />
                          Your browser does not support video playback.
                        </video>
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity`}>
                          <span className="text-white text-lg">
                            Play Video
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className={`text-lg font-semibold ${themeColors.text} line-clamp-1`}>
                          {video.title}
                        </h3>
                        {video.description && (
                          <p className={`mt-2 ${themeColors.secondaryText} text-sm line-clamp-2`}>
                            {video.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation Buttons */}
              <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 -translate-x-5">
                <FiChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-x-5">
                <FiChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Rest of the Content */}
      <div className="flex flex-row-reverse">
        {/* Sidebar */}
        <aside className="w-64 p-4 hidden lg:block">
          <div className="space-y-2 sticky top-4">
            {categories.map(category => (
              <Link
                href={`/categories/${category.id}`}
                key={category.id}
                className={`block p-2 rounded-lg transition-colors duration-300 hover:bg-opacity-80 border border-gray-200 dark:border-gray-700`}
              >
                <span className={themeColors.text}>{category.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Posts */}
        <main className="flex-grow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link href={`/posts/${post.id}`} key={post.id}>
                <div className={`rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-105`}>
                  {post.media && post.media[0] && (
                    <div className="relative h-48">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${post.media[0].media_url}`}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className={`text-xl font-semibold mb-2 ${themeColors.text}`}>{post.title}</h3>
                    <p className={`${themeColors.textLight} line-clamp-3`}>{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </main>
  );
}
