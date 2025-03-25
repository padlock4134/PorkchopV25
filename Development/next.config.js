/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Explicitly set server port to 3000
  serverRuntimeConfig: {
    port: 3000,
  },
  
  // Enable static optimization for faster page loads
  experimental: {
    optimizeFonts: true,
  },
  
  // Configure image domains if needed
  images: {
    domains: ['ui-avatars.com'],
  },
  
  // Enable Static Exports
  output: process.env.EXPORT_STATIC === 'true' ? 'export' : undefined,
  
  // Set environment variables
  env: {
    APP_NAME: 'PorkChop',
    APP_VERSION: '2.0.0',
  },

  // Configure webpack if needed
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;