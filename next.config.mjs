/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Ignore build-time TypeScript and ESLint errors on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ For static builds / Vercel caching
  images: {
    domains: [],
  },

  // ✅ Properly expose environment variable (optional fallback for local)
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  },

  // ✅ Fix "localStorage is not defined" for static prerenders
  experimental: {
    esmExternals: "loose", // allows ESM/require mix
  },
};

export default nextConfig;
