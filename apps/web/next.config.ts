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
};

export default nextConfig;
