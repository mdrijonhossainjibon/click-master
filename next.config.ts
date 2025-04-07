import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove i18n config as it's not needed with App Router
  trailingSlash: true,
  images: {
    domains: ['flagcdn.com','upload.wikimedia.org' ,'images.remotePatterns','play-lh.googleusercontent.com','s2.coinmarketcap.com','s2.coinmarketcap.com'],
  },
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;
