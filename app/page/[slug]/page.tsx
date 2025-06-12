
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { Page } from '../../../types';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
import { parseFrontMatter } from '../../../utils/frontMatterParser';

export async function generateStaticParams() {
  const pagesDir = path.join(process.cwd(), 'public', 'content', 'pages');
  try {
    const files = await fs.readdir(pagesDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => ({ slug: file.replace(/\.md$/, '') }));
  } catch (err) {
    console.error('Error reading pages directory:', err);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const GenericPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public', 'content', 'pages', `${slug}.md`);

  try {
    const rawContent = await fs.readFile(filePath, 'utf-8');
    const { frontMatter, content: markdownBody } = parseFrontMatter(rawContent);

    const pageData: Page = {
      slug,
      title: (frontMatter.title as string) || 'Untitled Page',
      markdownContent: markdownBody,
    };

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-lg shadow-xl p-6 md:p-10">
          <header className="mb-8 border-b pb-6 border-gray-200">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-800">{pageData.title}</h1>
          </header>

          {pageData.markdownContent ? (
            <MarkdownRenderer content={pageData.markdownContent} />
          ) : (
            <p className="text-gray-500">Content is not available for this page.</p>
          )}

          <footer className="mt-12 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-800 hover:underline font-semibold transition-colors"
            >
              &larr; Back to Home
            </Link>
          </footer>
        </article>
      </div>
    );
  } catch (err) {
    console.error('Error reading page content:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-lg text-gray-700 mb-6">{`Could not load page content. ${message}`}</p>
        <Link
          href="/"
          className="bg-primary-600 text-white font-semibold px-6 py-3 rounded hover:bg-primary-700 transition-colors duration-300"
        >
          Back to Home
        </Link>
      </div>
    );
  }
};

export default GenericPage;
