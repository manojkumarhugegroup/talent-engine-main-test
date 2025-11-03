import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ✅ This disables ESLint during builds
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // or '20mb' if you're feeling rebellious
    },
  },
};

export default nextConfig;
