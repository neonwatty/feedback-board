import { defineConfig } from "tsup";

export default defineConfig([
  // Client components + provider (needs "use client" banner)
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: [
      "react",
      "react-dom",
      "next",
      "next/link",
      "next/navigation",
      "@supabase/supabase-js",
    ],
    banner: {
      js: '"use client";',
    },
  },
  // Server-safe actions (NO "use client" banner)
  {
    entry: { actions: "src/actions/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    external: [
      "@supabase/supabase-js",
    ],
  },
]);
