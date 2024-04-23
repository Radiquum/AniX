/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anixstatic.com",
      },
    ],
  },
};

export default nextConfig;
