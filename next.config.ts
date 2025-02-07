import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,  // 构建时忽略 ESLint 错误
  },
  typescript: {
    ignoreBuildErrors: true,  // 构建时忽略 TypeScript 类型检查错误
  },
};

export default nextConfig;
