import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  /* Blog posts are read from content/blog at request time when a page
     revalidates, so the files must ship with every function that lists or
     renders posts. */
  outputFileTracingIncludes: {
    "/*": ["./content/blog/**/*"],
  },
};

export default nextConfig;
