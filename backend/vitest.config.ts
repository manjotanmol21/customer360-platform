import {
  defineConfig,
} from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    include: [
      "tests/**/*.test.ts",
    ],

    setupFiles: [
      "./tests/setup.ts",
    ],

    fileParallelism: false,

    clearMocks: true,
    restoreMocks: true,

    testTimeout: 10_000,
    hookTimeout: 10_000,

    coverage: {
      provider: "v8",

      reportsDirectory:
        "./coverage",

      reporter: [
        "text",
        "json-summary",
        "html",
        "lcov",
      ],

      include: [
        "src/**/*.ts",
      ],

      exclude: [
        "src/generated/**",
        "src/server.ts",
      ],

      thresholds: {
        statements: 75,
        branches: 55,
        functions: 70,
        lines: 75,
      },
    },
  },
});