import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "cdn.loom.com",
        pathname: "/sessions/thumbnails/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.110.242"],
};

export default nextConfig;
