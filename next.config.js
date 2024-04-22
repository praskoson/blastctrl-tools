/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: "cloudinary",
    path: "https://res.cloudinary.com/doz0obwb0/image/fetch/",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // typescript: { ignoreBuildErrors: true },
};

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

module.exports = nextConfig;
