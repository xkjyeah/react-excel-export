/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side rendering for all pages
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig;
