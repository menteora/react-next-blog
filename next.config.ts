import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/react-next-blog",
  assetPrefix: isProd ? "/react-next-blog/" : undefined,
  images: {
    // GitHub Pages can't handle dynamic image optimization
    unoptimized: true,
  },
  output: "export",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/react-next-blog",
  },
};

export default nextConfig;
