import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    skipWaiting: true,
  },
});

const baseConfig: NextConfig = {
  // Force tracing root to this project to avoid picking parent lockfile
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gamek.mediacdn.vn',
      },
      {
        protocol: 'https',
        hostname: 'am-a.akamaihd.net',
      },
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fsgn19-1.fna.fbcdn.net',
      },
      // Story Tour - new image sources
      {
        protocol: 'https',
        hostname: 'thanhnien.mediacdn.vn',
      },
      {
        protocol: 'https',
        hostname: 'genk.mediacdn.vn',
      },
      {
        protocol: 'https',
        hostname: 'kenh14cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.esports.gg',
      },
    ],
  },
  // Allow access from network
  async rewrites() {
    return [];
  },
};

const nextConfig: NextConfig = withPWA(baseConfig);

export default nextConfig;


