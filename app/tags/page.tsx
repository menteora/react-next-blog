
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPostMetadataBySlug } from '../../utils/postUtils';

// ALL_POST_SLUGS removed

const TagsPage: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const manifestResponse = await fetch('/api/post-slugs');
        if (!manifestResponse.ok) {
          throw new Error(`Failed to fetch post list: ${manifestResponse.statusText} (status ${manifestResponse.status})`);
        }
        const postSlugs: string[] = await manifestResponse.json();

        if (!Array.isArray(postSlugs)) {
            throw new Error('Post manifest is not a valid array.');
        }
        
        if (postSlugs.length === 0) {
          setTags([]);
          setIsLoading(false);
          return;
        }

        const postsMetadata = await Promise.all(
          postSlugs.map(slug => fetchPostMetadataBySlug(slug))
        );
        const validPosts = postsMetadata.filter(post => !post.title.startsWith('Error Loading:'));
        const allTagsWithDuplicates = validPosts.flatMap(post => post.tags);
        const uniqueTags = Array.from(new Set(allTagsWithDuplicates)).sort((a, b) => a.localeCompare(b));
        setTags(uniqueTags);
      } catch (err: unknown) {
        console.error("Failed to load tags:", err);
        const message = err instanceof Error ? err.message : String(err);
        const userActionMessage = "This usually means the posts directory is missing under 'public/content/posts'.";
        setError(`Error: ${message}. ${userActionMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadTags();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading tags...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Tags</h1>
        <p className="text-lg text-gray-700 whitespace-pre-line">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-primary-800">All Tags</h1>
        <p className="text-xl text-gray-600 mt-2">Browse posts by topic.</p>
      </header>

      {tags.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {tags.map(tag => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="bg-primary-600 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow hover:bg-primary-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={`View posts tagged with ${tag}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">No tags found.</h2>
          <p className="text-gray-500 mt-2">It looks like there are no tags associated with any posts yet, or the post manifest file is not configured.</p>
        </div>
      )}
    </div>
  );
};

export default TagsPage;
