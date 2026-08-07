import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@jerseyflow/ui", "@jerseyflow/types", "@jerseyflow/config", "@jerseyflow/validation"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://127.0.0.1:8787/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
