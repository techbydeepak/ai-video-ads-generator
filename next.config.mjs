/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.heygen.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.website-files.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },

  webpack(config) {
    // Ignore .d.ts files in bundling
    config.module.rules.push({
      test: /\.d\.ts$/,
      use: 'ignore-loader',
    });
    return config;
  },
};

export default nextConfig;
