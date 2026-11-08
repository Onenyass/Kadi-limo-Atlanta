import type { NextConfig } from "next";

const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

const nextConfig: NextConfig = {
  images: {
    // Sanity's image CDN, used once the CMS is connected.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  poweredByHeader: false,
  async headers() {
    // Preview deployments send a noindex header on every response, in addition
    // to the robots meta tag and robots.txt. Removed automatically at launch.
    if (indexable) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
