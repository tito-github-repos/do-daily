import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,

  // Bundle the private PDF with the download route in production builds
  outputFileTracingIncludes: {
    "/api/download": ["./private/**/*"],
  },

  // The PDF used to be public: send old links to the download section instead of a 404
  async redirects() {
    return [
      {
        source: "/downloads/DoDaily-Exercise-Sheet.pdf",
        destination: "/#exercises",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;