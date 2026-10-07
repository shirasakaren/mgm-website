import type { NextConfig } from "next";

// Served from GitHub Pages: on the site's own domain this is empty; on a
// project URL (https://<owner>.github.io/<repo>) the Pages workflow sets it
// to "/<repo>". Asset paths read the same variable (src/lib/base-path.ts).
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // A fully static site: `next build` writes every page to `out/`.
  output: "export",
  basePath: basePath || undefined,
  // The development route indicator obscures interactive UI while reviewing
  // the site locally. Compile and runtime errors remain available in the
  // terminal and browser overlay.
  devIndicators: false,
  images: {
    // No image optimization server on a static host: images ship as they are.
    unoptimized: true,
  },
};

export default nextConfig;
