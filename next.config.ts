import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a self-contained output folder for Docker deployments
  output: "standalone",
};

export default nextConfig;
