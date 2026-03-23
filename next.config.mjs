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
};

export default nextConfig;