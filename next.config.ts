import type { NextConfig } from "next";

// GITHUB_PAGES=true produces a static export under the /Project_1 base path
// (the repo's GitHub Pages URL). Local dev/build stay unaffected.
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isPages && {
    output: "export" as const,
    basePath: "/Project_1",
    trailingSlash: true,
  }),
};

export default nextConfig;
