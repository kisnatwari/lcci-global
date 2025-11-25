import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'themystickeys.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      // Add common image hosting domains
      {
        protocol: 'https',
        hostname: '**.wwe.com', // Wildcard for subdomains
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: '**.wikimedia.org',
      },
      // DigitalOcean Spaces
      {
        protocol: 'https',
        hostname: 'lcci.fra1.cdn.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
      },
    ],
    // Allow unoptimized images for external domains not in the list
    unoptimized: false,
  },
};

export default nextConfig;
