import type { NextConfig } from "next";
// next-pwa types are slightly out of sync with Next 15,
// so we import with a relaxed type.
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const baseConfig: NextConfig = {
  // Force tracing root to this project to avoid picking parent lockfile
  outputFileTracingRoot: __dirname,
  // Allow access from network
  async rewrites() {
    return [];
  },
};

const nextConfig: NextConfig = withPWA(baseConfig);

export default nextConfig;


