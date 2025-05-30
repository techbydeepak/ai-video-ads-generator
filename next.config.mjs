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
      // Add any other domains you need
    ],
    // Optional: Add these for better caching
    minimumCacheTTL: 60,
    formats: ['image/webp'],
  },
  
  // For Convex and other dependencies
  experimental: {
    serverComponentsExternalPackages: ['axios', 'convex'],
  },
  
  webpack: (config) => {
    // Ignore .d.ts files
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: 'ignore-loader',
    });
    
    return config;
  },
  
  // Recommended for Vercel deployments
  output: 'standalone',
};

export default nextConfig;