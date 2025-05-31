/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.heygen.com',
      },
      {
        protocol: 'https',
        hostname: 'static.website-files.org', 
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
    // Added deviceSizes for better responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  
  // Updated experimental config
  experimental: {
    serverExternalPackages: ['axios', 'convex', '@clerk/nextjs'],
    optimizePackageImports: ['@clerk/nextjs'], // Optional optimization
    ppr: false,
  },
  
  webpack: (config) => {
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: 'ignore-loader',
    });
    return config;
  },
  
  output: 'standalone',
};

export default nextConfig;