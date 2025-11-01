import type { NextConfig } from "next";
import { config } from 'dotenv';
import path from 'path';
import withPWA from 'next-pwa';

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

// PWA configuration
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Disable PWA in development to avoid Webpack/Turbopack conflicts
  disable: process.env.NODE_ENV === 'development',
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
};

// Wrap with PWA configuration
export default withPWA(pwaConfig)(nextConfig);
