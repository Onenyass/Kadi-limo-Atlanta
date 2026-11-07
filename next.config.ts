import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity's image CDN, used once the CMS is connected.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  poweredByHeader: false,
};

export default nextConfig;
