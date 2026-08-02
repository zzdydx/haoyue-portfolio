import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgSite = repositoryName.endsWith(".github.io");
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.GITHUB_PAGES === "true" && repositoryName && !isUserOrOrgSite
    ? `/${repositoryName}`
    : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
