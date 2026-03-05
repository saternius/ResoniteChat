import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.resonite.com",
      },
      {
        protocol: "https",
        hostname: "api.resonite.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/assets-proxy/:path*",
        destination: "https://assets.resonite.com/:path*",
      },
    ];
  },
};

export default nextConfig;
