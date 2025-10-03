import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore: turbopack experimental option (may be missing in types)
    turbopack: {
      root: path.resolve(__dirname),
    },
  } as any,
};

export default nextConfig;
