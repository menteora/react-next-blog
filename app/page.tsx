
"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchPostMetadataBySlug } from '../utils/postUtils';
import PostCard from '../components/PostCard';
import { Post } from '../types';
import { useSiteConfig } from '../contexts/SiteConfigContext';

const POSTS_PER_PAGE = 10;

// ALL_POST_SLUGS removed

const HomePage: React.FC = () => {
  const { config, isLoading: isConfigLoading, error: configError } = useSiteConfig();
  const [allPosts, setAllPosts] = useState<Omit<Post, 'markdownContent'>[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true);
      setPostsError(null);
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const manifestResponse = await fetch(`${basePath}/api/post-slugs`);
        if (!manifestResponse.ok) {
          throw new Error(`Failed to fetch post list: ${manifestResponse.statusText} (status ${manifestResponse.status})`);
        }
        const postSlugs: string[] = await manifestResponse.json();

        if (!Array.isArray(postSlugs)) {
            throw new Error('Post manifest is not a valid array.');
        }

        if (postSlugs.length === 0) {
          setAllPosts([]);
          setIsLoadingPosts(false);
          return;
        }

        const fetchedPostsMetadata = await Promise.all(
          postSlugs.map(slug => fetchPostMetadataBySlug(slug))
        );
        
        const validPosts = fetchedPostsMetadata.filter(post => !post.title.startsWith('Error Loading:'));
        
        const sortedPosts = validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAllPosts(sortedPosts);
      } catch (err: unknown) {
        console.error("Failed to load posts:", err);
        const message = err instanceof Error ? err.message : String(err);
        const userActionMessage = "This usually means the posts directory is missing under 'public/content/posts'.";
        setPostsError(`Error: ${message}. ${userActionMessage}`);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    loadPosts();
  }, []);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const rawHeroImage = isConfigLoading || configError ? null : config.homepageHeroImageUrl;
  const heroImageUrl = rawHeroImage && !rawHeroImage.startsWith('http')
    ? `${basePath}${rawHeroImage}`
    : rawHeroImage;

  // Pagination logic
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (isLoadingPosts) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        <p className="ml-4 text-lg text-gray-700">Loading posts...</p>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading Posts</h1>
        <p className="text-lg text-gray-700 whitespace-pre-line">{postsError}</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-20 flex justify-center py-5">
      <div className="flex flex-col max-w-[960px] w-full">
        {heroImageUrl && (
          <section className="mb-6 relative rounded-lg overflow-hidden min-h-[218px] @container">
            <Image
              src={heroImageUrl}
              alt="Blog hero banner"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 960px"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="relative flex p-4">
              <p className="text-white tracking-light text-[28px] font-bold leading-tight">Welcome to the Blog</p>
            </div>
          </section>
        )}

        <header className="mb-8 text-center">
          <p className="text-brand-muted text-base">Discover insights and stories on web development, technology, and more.</p>
        </header>

        {currentPosts.length > 0 ? (
          <>
            {currentPosts.map(post => (
              <div key={post.slug} className="p-4">
                <PostCard post={post as Post} />
              </div>
            ))}
            {totalPages > 1 && (
              <nav aria-label="Posts pagination" className="mt-4 flex items-center justify-center gap-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex size-10 items-center justify-center disabled:text-gray-300"
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                  </svg>
                </button>
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`text-sm flex size-10 items-center justify-center rounded-full ${
                      currentPage === number ? 'font-bold bg-brand-light' : ''
                    }`}
                    aria-current={currentPage === number ? 'page' : undefined}
                    aria-label={`Go to page ${number}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex size-10 items-center justify-center disabled:text-gray-300"
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                  </svg>
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">No posts yet!</h2>
            <p className="text-gray-500 mt-2">Check back soon for new content, or ensure the post manifest file is configured if posts exist.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
