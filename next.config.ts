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

// PWA configuration - conditionally apply to avoid Next.js 15 compatibility issues
let configToExport = nextConfig;

// Only apply PWA in production builds (not during development or static export)
if (process.env.NODE_ENV === 'production' && !enableStaticExport) {
  try {
    // Use dynamic require to handle compatibility issues
    const withPWA = require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      // Exclude middleware manifest from PWA build
      buildExcludes: [/middleware-manifest\.json$/],
      runtimeCaching: [
        {
          urlPattern: /^https?.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'offlineCache',
            expiration: {
              maxEntries: 200,
            },
          },
        },
      ],
    });
    configToExport = withPWA(nextConfig);
  } catch (error) {
    console.warn('Failed to load next-pwa, continuing without PWA support:', error);
  }
}

export default configToExport;
