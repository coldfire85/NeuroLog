/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 'placehold.co'],
  },
  async redirects() {
    return [
      {
        source: '/login',
        has: [
          {
            type: 'cookie',
            key: 'next-auth.session-token',
          },
        ],
        destination: '/procedures',
        permanent: false,
      },
      {
        source: '/register',
        has: [
          {
            type: 'cookie',
            key: 'next-auth.session-token',
          },
        ],
        destination: '/procedures',
        permanent: false,
      },
    ];
  },
  // Disable experimental features that might cause issues
  experimental: {
    serverActions: false,
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
