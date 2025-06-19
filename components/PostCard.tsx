
"use client";

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
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
    <article className="relative bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col cursor-pointer">
      <Link
        href={`/post/${post.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Read more about ${post.title}`}
      >
        <span className="sr-only">{`Read more about ${post.title}`}</span>
      </Link>
      {post.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageSrc as string}
            alt={`Featured image for ${post.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
            priority={false}
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow relative z-20">
        <h2 className="text-2xl font-bold text-primary-800 mb-2">{post.title}</h2>
        <div className="text-sm text-gray-500 mb-3">
          <span>By {post.author}</span> | <span>{new Date(post.date).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-700 mb-4 leading-relaxed flex-grow">{post.excerpt}</p>
        <div className="mb-4">
          {post.tags.map(tag => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full hover:bg-primary-200 transition-colors duration-200"
              aria-label={`View posts tagged with ${tag}`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
