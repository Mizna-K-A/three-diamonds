/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverActions: {
    bodySizeLimit: '100mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
    middlewareClientMaxBodySize: '100mb',
  },
  middlewareClientMaxBodySize: '100mb',

  images: {
    remotePatterns: [
      // CloudFront CDN (primary image host)
      {
        protocol: 'https',
        hostname: 'd13bzymge9vu8q.cloudfront.net',
        pathname: '/**',
      },
      // Direct S3 fallback (ap-south-1)
      {
        protocol: 'https',
        hostname: '*.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;