import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: false, // Change to false to prevent double-rendering in development
  webpack: (config) => {
    // Add fallbacks for Node.js modules
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(process.cwd(), './src'),
    };
    
    // Exclude backup directory from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backup/**', '**/backup-files/**']
    };
    
    return config;
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Explicitly set the directory structure
  distDir: '.next',
};

export default nextConfig;