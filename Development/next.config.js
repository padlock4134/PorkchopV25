/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Optional: Configure path aliases
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src');
    return config;
  },
  // Optional: Configure custom page extensions if needed
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Add image configuration
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure proper handling of static assets
  experimental: {
    // This helps with compatibility for certain features
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;