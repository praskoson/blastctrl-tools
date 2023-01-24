/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "cloudinary",
    path: "https://res.cloudinary.com/doz0obwb0/image/fetch/",
  },
  redirects: async () => [
    { source: "/nft-tools", destination: "/solana-nft-tools", permanent: true },
    { source: "/storage", destination: "/permanent-storage-tools", permanent: true },
    { source: "/tokens", destination: "/spl-token-tools", permanent: true },
    { source: "/nft-tools/:path", destination: "/solana-nft-tools/:path", permanent: true },
    { source: "/storage/:path", destination: "/permanent-storage-tools/:path", permanent: true },
    { source: "/tokens/:path", destination: "/spl-token-tools/:path", permanent: true },
  ],
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
