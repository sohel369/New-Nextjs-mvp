import type { NextConfig } from "next";
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from local.env
config({ path: path.resolve(process.cwd(), 'local.env') });

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
