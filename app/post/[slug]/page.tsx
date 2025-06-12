import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '../../../types';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
import { parseFrontMatter } from '../../../utils/frontMatterParser';

// SVG Icons for Social Sharing
const TwitterIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.992 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.59-11.018-3.714v-2.155z" />
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

const DEFAULT_POST_PAGE_VALUES: Omit<Post, 'slug'> = {
  title: 'Untitled Post',
  date: new Date().toISOString().split('T')[0],
  author: 'Unknown Author',
  excerpt: 'No excerpt available for this post.',
  tags: [],
  imageUrl: undefined,
  markdownContent: '# Content Not Found\n\nSorry, the content for this post could not be loaded.',
};

async function getPostData(slug: string): Promise<Post> {
  const filePath = path.join(process.cwd(), 'public', 'content', 'posts', `${slug}.md`);
  try {
    const rawContent = await fs.readFile(filePath, 'utf-8');
    const { frontMatter, content } = parseFrontMatter(rawContent);

    let tags: string[] = [];
    if (frontMatter.tags) {
      if (typeof frontMatter.tags === 'string') {
        tags = frontMatter.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (Array.isArray(frontMatter.tags)) {
        tags = frontMatter.tags.map(tag => String(tag).trim()).filter(Boolean);
      }
    }

    const post: Post = {
      slug,
      title: (frontMatter.title as string) || DEFAULT_POST_PAGE_VALUES.title,
      date: (frontMatter.date as string) || DEFAULT_POST_PAGE_VALUES.date,
      author: (frontMatter.author as string) || DEFAULT_POST_PAGE_VALUES.author,
      excerpt: (frontMatter.excerpt as string) || DEFAULT_POST_PAGE_VALUES.excerpt,
      tags: tags.length > 0 ? tags : DEFAULT_POST_PAGE_VALUES.tags,
      imageUrl: (frontMatter.imageUrl as string) || DEFAULT_POST_PAGE_VALUES.imageUrl,
      markdownContent: content || DEFAULT_POST_PAGE_VALUES.markdownContent,
    };

    return post;
  } catch (err) {
    console.error('Error reading post content:', err);
    return { ...DEFAULT_POST_PAGE_VALUES, slug, title: `Error: ${slug}` };
  }
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'public', 'content', 'posts');
  try {
    const files = await fs.readdir(postsDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({ slug: file.replace(/\.md$/, '') }));
  } catch (err) {
    console.error('Error reading posts directory:', err);
    return [];
  }
}

const PostPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const post = await getPostData(slug);

  const postUrl = `/post/${post.slug}`;
  const encodedPostUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedExcerpt = encodeURIComponent(post.excerpt);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedPostUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedPostUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedPostUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedPostUrl}`,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="bg-white rounded-lg shadow-xl p-6 md:p-10">
        <header className="mb-8 border-b pb-6 border-gray-200">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-800 mb-3">{post.title}</h1>
          <div className="text-md text-gray-500">
            <span>By {post.author}</span> | <span>Published on {new Date(post.date).toLocaleDateString()}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full hover:bg-primary-200 hover:text-primary-800 transition-colors duration-200"
                  aria-label={`View posts tagged with ${tag}`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {post.imageUrl && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={post.imageUrl}
              alt={`Featured image for ${post.title}`}
              width={1200}
              height={500}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {post.markdownContent ? (
          <MarkdownRenderer content={post.markdownContent} />
        ) : (
          <p className="text-gray-500">Content is not available for this post.</p>
        )}

        <div className="mt-10 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Share this post</h3>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <a
              href={shareLinks.twitter}
              aria-label="Share on Twitter"
              title="Share on Twitter"
              className="text-gray-500 hover:text-[#1DA1F2] p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1DA1F2] transition-colors duration-200"
              target="_blank" rel="noopener noreferrer"
            >
              <TwitterIcon />
            </a>
            <a
              href={shareLinks.facebook}
              aria-label="Share on Facebook"
              title="Share on Facebook"
              className="text-gray-500 hover:text-[#1877F2] p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] transition-colors duration-200"
              target="_blank" rel="noopener noreferrer"
            >
              <FacebookIcon />
            </a>
            <a
              href={shareLinks.linkedin}
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
              className="text-gray-500 hover:text-[#0A66C2] p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A66C2] transition-colors duration-200"
              target="_blank" rel="noopener noreferrer"
            >
              <LinkedInIcon />
            </a>
            <a
              href={shareLinks.email}
              aria-label="Share via Email"
              title="Share via Email"
              className="text-gray-500 hover:text-primary-600 p-2.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              target="_blank" rel="noopener noreferrer"
            >
              <EmailIcon />
            </a>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-800 hover:underline font-semibold transition-colors"
          >
            &larr; Back to all posts
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default PostPage;
