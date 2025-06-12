import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// When building the app for static export, Next.js requires API routes
// to opt into static generation. Setting `dynamic` to "force-static" makes
// this route run at build time so the resulting JSON file can be served
// without a Node.js runtime.
export const dynamic = 'force-static';

export async function GET() {
  try {
    const postsDir = path.join(process.cwd(), 'public', 'content', 'posts');
    const files = await fs.promises.readdir(postsDir);
    const slugs = files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
    return NextResponse.json(slugs);
  } catch (error) {
    console.error('Error reading posts directory:', error);
    return NextResponse.json(
      { error: 'Failed to read posts directory' },
      { status: 500 }
    );
  }
}
