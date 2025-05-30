import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jxav25iy4j.ufs.sh",
      },
    ],
  },
  experimental: {
    dynamicIO: true,
  },
};

export default nextConfig;
