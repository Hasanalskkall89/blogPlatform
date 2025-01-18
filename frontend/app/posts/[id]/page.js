import Image from 'next/image';

async function getPost(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`, {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch post');
  }
 
  return res.json();
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <article className="container mx-auto p-4 max-w-4xl">
        {/* Main Article Image */}
        {post.media && post.media[0] && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}${post.media[0].media_url}`}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>
        )}

        {/* Article Title */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.title}
        </h1>

        {/* Article Info */}
        <div className="flex items-center gap-4 mb-8 text-gray-600 dark:text-gray-400">
          <div>
            {new Date(post.created_at).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          {post.category && (
            <div className="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700">
              {post.category.name}
            </div>
          )}
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none rtl dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Videos */}
        {post.media && post.media.filter(m => m.media_type === 'video').length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Related Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.media
                .filter(m => m.media_type === 'video')
                .map((video, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <video
                      className="w-full"
                      controls
                      poster={video.thumbnail_url}
                    >
                      <source src={`${process.env.NEXT_PUBLIC_API_URL}${video.media_url}`} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Additional Images */}
        {post.media && post.media.filter(m => m.media_type === 'image').length > 1 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Additional Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.media
                .filter(m => m.media_type === 'image')
                .slice(1)
                .map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${image.media_url}`}
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
      </article>
    </div>
  );
}
