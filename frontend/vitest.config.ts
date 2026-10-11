import {
  defineConfig,
} from "vitest/config";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],

  test: {
    environment: "jsdom",

    setupFiles: [
      "./src/test/setup.ts",
    ],

    include: [
      "src/**/*.test.{ts,tsx}",
    ],

    pool: "threads",

    fileParallelism: false,

    maxWorkers: 1,

    isolate: false,

    clearMocks: true,

    restoreMocks: true,

    coverage: {
      provider: "v8",

      reporter: [
        "text",
        "html",
        "json-summary",
        "lcov",
      ],

      reportsDirectory: "./coverage",

      include: [
        "src/features/customers/customerSearchParams.ts",
        "src/components/customer/CustomerSearch.tsx",
        "src/components/customer/CustomerStatusFilter.tsx",
        "src/components/customer/CustomerSort.tsx",
        "src/components/customer/CustomerPagination.tsx",
        "src/components/customer/CustomerEmptyState.tsx",
      ],

      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  },
});