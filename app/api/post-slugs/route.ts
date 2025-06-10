import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
