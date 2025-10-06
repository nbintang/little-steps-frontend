import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // semua path di Cloudinary
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // semua path Google avatar
      },
    ],
  },
};

export default nextConfig;
