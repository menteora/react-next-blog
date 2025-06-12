import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: '/react-next-blog',
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/react-next-blog',
  },
};

export default nextConfig;
