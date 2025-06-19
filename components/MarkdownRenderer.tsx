
import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const customComponents: Components = {
    h1: ({ ...props }) => <h1 className="text-4xl font-bold my-6 border-b pb-2 border-gray-300 dark:border-gray-700" {...props} />,
    h2: ({ ...props }) => <h2 className="text-3xl font-semibold my-5 border-b pb-2 border-gray-200 dark:border-gray-600" {...props} />,
    h3: ({ ...props }) => <h3 className="text-2xl font-semibold my-4" {...props} />,
    p: ({ ...props }) => <p className="my-4 leading-relaxed" {...props} />,
    a: ({ ...props }) => <a className="text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100 underline" {...props} />,
    ul: ({ ...props }) => <ul className="list-disc pl-8 my-4 space-y-1" {...props} />,
    ol: ({ ...props }) => <ol className="list-decimal pl-8 my-4 space-y-1" {...props} />,
    li: ({ ...props }) => <li className="my-1" {...props} />,
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      if (match) {
        return (
          <pre className="bg-gray-900 text-white p-4 rounded-md my-4 overflow-x-auto">
            <code className={`language-${match[1]}`} {...props}>
              {String(children).replace(/\n$/, '')}
            </code>
          </pre>
        );
      }
      // For inline code, ensure className is handled gracefully
      return (
        <code className={`bg-gray-200 dark:bg-gray-800 text-red-600 px-1 py-0.5 rounded text-sm ${className || ''}`} {...props}>
          {children}
        </code>
      );
    },
    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400" {...props} />,
  };

  return (
    <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={customComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
