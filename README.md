This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Blog Content Structure

Markdown files in `public/content` drive the blog:

- `public/content/posts` - individual blog posts. Each file name becomes the URL slug and must contain YAML front matter (see existing posts for examples).
- `public/content/pages` - static pages such as `about.md`.
- `public/config.yml` - site-wide values like the blog title and hero image.

## Building and Exporting

Run the build command to create the static site:

```bash
npm run build
```

`next.config.ts` sets `output: 'export'`, so `next build` automatically runs `next export` and produces the static files in the `out` directory. If you remove that option you must run `next export` after the build.

The configuration also sets `basePath` and `assetPrefix` to `/react-next-blog` and disables image optimization (`images.unoptimized = true`) so the exported files work when hosted on GitHub Pages.

## Adding Posts and Pages

1. Create a new Markdown file in `public/content/posts` (or `public/content/pages`).
2. Include the front matter fields (`title`, `date`, `author`, etc.).
3. Update any global settings in `public/config.yml` if needed.

## Commit Workflow

Before committing, run ESLint and fix any issues:

```bash
npm run lint
```

