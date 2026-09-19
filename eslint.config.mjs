import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The data layer boundary. Components read through `@/lib/data` only, so
    // that Stage 2 can swap the mock fixtures for Supabase queries without
    // touching anything that renders.
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "providers/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/mock", "@/lib/mock/*", "**/lib/mock/*"],
              message:
                "Import from '@/lib/data' instead. Components must not reach into the mock fixtures directly — see the data layer boundary in README.md.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
