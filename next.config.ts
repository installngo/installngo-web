import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "installngo-files-dev.s3.us-east-1.amazonaws.com",        
      },
      {
        protocol: "https",
        hostname: "d2txwivl0hdlht.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;