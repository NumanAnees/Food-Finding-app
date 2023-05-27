/**@type {import('next').NextConfig} **/

const withPWA = require("next-pwa")({
  dest: "public",
  register: "true",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "images.ctfassets.net",
      "images.unsplash.com",
      "images.pexels.com",
      "images.unsplash.com",
      "images.ctfassets.net",
      "images.unsplash.c",
    ],
  },
});

module.exports = nextConfig;
