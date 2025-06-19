
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import PostCard from '../../../components/PostCard';
import { Post } from '../../../types';
import { parseFrontMatter } from '../../../utils/frontMatterParser';
import slugify from '../../../utils/slugify';

interface PageProps {
  params: Promise<{ tagName: string }>;
}

const DEFAULT_POST_VALUES: Omit<Post, 'slug' | 'markdownContent'> = {
  title: 'Untitled Post',
  date: new Date().toISOString().split('T')[0],
  author: 'Unknown Author',
  excerpt: 'No excerpt available for this post.',
  tags: [],
  imageUrl: undefined,
};

async function getAllPostsMetadata(): Promise<Omit<Post, 'markdownContent'>[]> {
  const postsDir = path.join(process.cwd(), 'public', 'content', 'posts');
  try {
    const files = await fs.readdir(postsDir);
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async file => {
          const slug = file.replace(/\.md$/, '');
          const raw = await fs.readFile(path.join(postsDir, file), 'utf-8');
          const { frontMatter } = parseFrontMatter(raw);

          let tags: string[] = [];
          if (frontMatter.tags) {
            if (typeof frontMatter.tags === 'string') {
              tags = frontMatter.tags.split(',').map(t => t.trim()).filter(Boolean);
            } else if (Array.isArray(frontMatter.tags)) {
              tags = frontMatter.tags.map(t => String(t).trim()).filter(Boolean);
            }
          }

          return {
            slug,
            title: (frontMatter.title as string) || DEFAULT_POST_VALUES.title,
            date: (frontMatter.date as string) || DEFAULT_POST_VALUES.date,
            author: (frontMatter.author as string) || DEFAULT_POST_VALUES.author,
            excerpt: (frontMatter.excerpt as string) || DEFAULT_POST_VALUES.excerpt,
            tags: tags.length > 0 ? tags : DEFAULT_POST_VALUES.tags,
            imageUrl: (frontMatter.imageUrl as string) || DEFAULT_POST_VALUES.imageUrl,
          };
        })
    );
    return posts;
  } catch (err) {
    console.error('Error reading posts directory:', err);
    return [];
  }
}

export async function generateStaticParams() {
  const posts = await getAllPostsMetadata();
  const tagSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).map(tag => ({ tagName: slugify(tag) }));
}

const PostsByTagPage = async ({ params }: PageProps) => {
  const { tagName } = await params;
  const posts = await getAllPostsMetadata();
  const postsForTag = posts.filter(post =>
    post.tags.some(t => slugify(t) === tagName)
  );
  const displayTag =
    postsForTag[0]?.tags.find(t => slugify(t) === tagName) || tagName;
  const sortedPosts = postsForTag.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-primary-800 dark:text-primary-100 mb-2">
          Posts tagged with: <span className="text-primary-700 dark:text-primary-300">{displayTag || 'Unknown Tag'}</span>
        </h1>
        <Link
          href="/tags"
          className="text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100 hover:underline font-semibold transition-colors"
        >
          &larr; View all tags
        </Link>
      </header>

      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map(post => (
            <PostCard key={post.slug} post={post as Post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No posts found for this tag.</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Try browsing other tags or viewing all posts. Ensure the post manifest is configured if you expect posts here.</p>
          <Link
            href="/"
            className="mt-6 inline-block bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded transition-colors"
          >
            View All Posts
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostsByTagPage;
