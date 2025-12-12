import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Force tracing root to this project to avoid picking parent lockfile
  outputFileTracingRoot: __dirname,
  // Allow access from network
  async rewrites() {
    return [];
  },
};

export default nextConfig;


