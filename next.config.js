/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile bcrypt to avoid WebAssembly errors
  webpack: (config) => {
    // This is needed to handle the native modules used in bcrypt
    config.externals = [...config.externals, 'bcrypt'];

    // Add a fallback for node modules that Next.js has issues with
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      aws4: false,
      'mock-aws-s3': false,
      'aws-sdk': false,
      nock: false,
    };

    return config;
  },

  // Allow importing images from external sources
  images: {
    domains: ['placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Environment variables that will be available in the browser
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // External packages that should be transpiled
  serverExternalPackages: ['bcrypt'],

  // Remove ESLint warnings during build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
