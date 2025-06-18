
"use client";

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Post } from '../types';
import slugify from '../utils/slugify';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const imageSrc =
    post.imageUrl && !post.imageUrl.startsWith('http')
      ? `${basePath}${post.imageUrl}`
      : post.imageUrl;

  return (
    <article className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-lg">
      <div className="flex flex-col gap-4 flex-[2_2_0px]">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded-full hover:bg-primary-200 hover:text-primary-800 transition-colors duration-200"
              aria-label={`View posts tagged with ${tag}`}
            >
              {tag}
            </Link>
          ))}
        </div>
        <h2 className="text-brand-dark text-base md:text-lg font-bold leading-tight">
          <Link href={`/post/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className="text-brand-muted text-sm leading-normal flex-grow">{post.excerpt}</p>
        <div>
          <Link
            href={`/post/${post.slug}`}
            className="flex min-w-[84px] max-w-[480px] items-center justify-center h-8 px-4 bg-brand-light text-brand-dark text-sm font-medium rounded-lg w-fit"
          >
            <span className="truncate">Read More</span>
          </Link>
        </div>
      </div>
      {post.imageUrl && (
        <Link href={`/post/${post.slug}`} className="w-full md:flex-1" aria-hidden="true" tabIndex={-1}>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Image
              src={imageSrc as string}
              alt={`Featured image for ${post.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />
          </div>
        </Link>
      )}
    </article>
  );
};

export default PostCard;
