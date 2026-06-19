import Image from 'next/image';
import Link from 'next/link';
import { API_URL, BASE_URL } from '../../lib/api';

async function getPost(id) {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
 
  return res.json();
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);

  return (
    <div className="min-h-screen">
      <article className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/posts" className="hover:text-blue-500 transition-colors">Articles</Link>
          {post.category && (
            <>
              <span>/</span>
              <Link href={`/categories/${post.category.id}`} className="hover:text-blue-500 transition-colors">
                {post.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-200 truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Main Article Image */}
        {post.media && post.media[0] && (
          <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={`${BASE_URL}${post.media[0].media_url}`}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
              priority
            />
          </div>
        )}

        {/* Article Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        {/* Article Info */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          {post.category && (
            <Link
              href={`/categories/${post.category.id}`}
              className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              {post.category.name}
            </Link>
          )}
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none rtl dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-img:rounded-lg prose-a:text-blue-600 dark:prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Videos */}
        {post.media && post.media.filter(m => m.media_type === 'video').length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Related Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.media
                .filter(m => m.media_type === 'video')
                .map((video, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-md">
                    <video
                      className="w-full"
                      controls
                      poster={video.thumbnail_url}
                    >
                      <source src={`${BASE_URL}${video.media_url}`} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Additional Images */}
        {post.media && post.media.filter(m => m.media_type === 'image').length > 1 && (
          <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Additional Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.media
                .filter(m => m.media_type === 'image')
                .slice(1)
                .map((image, index) => (
                  <div key={index} className="relative h-48 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <Image
                      src={`${BASE_URL}${image.media_url}`}
                      alt={`Image ${index + 2}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
