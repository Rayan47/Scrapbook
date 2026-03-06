import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eoysth7vvc.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },

    ],
  },
};

export default nextConfig;
