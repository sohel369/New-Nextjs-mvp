import type { NextConfig } from "next";
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from local.env
config({ path: path.resolve(process.cwd(), 'local.env') });

// Only enable static export when building for mobile (Capacitor)
// Set ENABLE_STATIC_EXPORT=true when building for mobile
const enableStaticExport = process.env.ENABLE_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // PWA optimizations
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  // Conditionally enable static export for Capacitor
  ...(enableStaticExport && {
    output: 'export',
    // Disable image optimization for static export
    images: {
      unoptimized: true,
    },
    // Ensure trailing slash for static export
    trailingSlash: true,
  }),
};

// PWA is now handled manually via components/PWARegister.tsx and public/sw.js
// This avoids compatibility issues with next-pwa and Next.js 15
let configToExport = nextConfig;

export default configToExport;
