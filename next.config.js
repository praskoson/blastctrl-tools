/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.arweave.net",
      "arweave.net",
      "ipfs.io",
      "cdn.blastctrl.com",
      "s3.eu-central-1.amazonaws.com",
      "dweb.link",
      "images.unsplash.com",
    ],
  },
};

module.exports = nextConfig;
