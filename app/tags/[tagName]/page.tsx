
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchPostMetadataBySlug } from '../../../utils/postUtils';
import PostCard from '../../../components/PostCard';
import { Post } from '../../../types';

// ALL_POST_SLUGS removed

const PostsByTagPage: React.FC = () => {
  const params = useParams();
  const encodedTagName = params?.tagName;
  const tagName = typeof encodedTagName === 'string' ? decodeURIComponent(encodedTagName) : undefined;

  const [filteredPosts, setFilteredPosts] = useState<Omit<Post, 'markdownContent'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tagName) {
      setError("Tag name not specified.");
      setIsLoading(false);
      return;
    }

    const loadPostsByTag = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const manifestResponse = await fetch('/content/post-manifest.json');
        if (!manifestResponse.ok) {
          throw new Error(`Failed to fetch post manifest: ${manifestResponse.statusText} (status ${manifestResponse.status})`);
        }
        const postSlugs: string[] = await manifestResponse.json();

        if (!Array.isArray(postSlugs)) {
            throw new Error('Post manifest is not a valid array.');
        }
        
        if (postSlugs.length === 0) {
          setFilteredPosts([]);
          setIsLoading(false);
          return;
        }

        const postsMetadata = await Promise.all(
          postSlugs.map(slug => fetchPostMetadataBySlug(slug))
        );
        const validPosts = postsMetadata.filter(post => !post.title.startsWith('Error Loading:'));
        
        const postsForTag = validPosts.filter(post => 
          post.tags.map(t => t.toLowerCase()).includes(tagName.toLowerCase())
        );
        
        const sortedPosts = postsForTag.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setFilteredPosts(sortedPosts);

      } catch (err: unknown) {
        console.error(`Failed to load posts for tag "${tagName}":`, err);
        const message = err instanceof Error ? err.message : String(err);
        const userActionMessage = "This usually means the file '/content/post-manifest.json' is missing in your 'public/content/' folder or is not accessible. Please create this file with a JSON array of your post slugs (e.g., [\"my-first-post\", \"another-post\"]).";
        setError(`Error loading posts for tag "${tagName}": ${message}. ${userActionMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPostsByTag();
  }, [tagName]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading posts for tag: {tagName}...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Posts</h1>
        <p className="text-lg text-gray-700 whitespace-pre-line">{error}</p>
        <Link
          href="/tags"
          className="mt-6 inline-block bg-primary-600 text-white font-semibold px-6 py-3 rounded hover:bg-primary-700 transition-colors duration-300"
        >
          View All Tags
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary-800 mb-2">
          Posts tagged with: <span className="text-primary-600">{tagName || 'Unknown Tag'}</span>
        </h1>
        <Link
          href="/tags"
          className="text-primary-600 hover:text-primary-800 hover:underline font-semibold transition-colors"
        >
          &larr; View all tags
        </Link>
      </header>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <PostCard key={post.slug} post={post as Post} /> 
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">No posts found for this tag.</h2>
          <p className="text-gray-500 mt-2">Try browsing other tags or viewing all posts. Ensure the post manifest is configured if you expect posts here.</p>
          <Link
            href="/"
            className="mt-6 inline-block bg-primary-600 text-white font-semibold px-6 py-3 rounded hover:bg-primary-700 transition-colors duration-300"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostsByTagPage;
