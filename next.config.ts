import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default locale is unprefixed (`localePrefix: 'as-needed'`).
  // `/` and `/tx/...` are rewritten to `/en/...` in `src/proxy.ts`.
};

export default nextConfig;
