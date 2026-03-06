/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // This is where it belongs
    },
  },
};

export default nextConfig;