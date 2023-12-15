/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    root: process.env.BASE_PATH || "",
  },
};

module.exports = nextConfig
