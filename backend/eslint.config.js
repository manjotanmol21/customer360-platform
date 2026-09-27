import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

import {
  defineConfig,
  globalIgnores,
} from "eslint/config";

export default defineConfig([
  globalIgnores([
    "coverage",
    "dist",
    "src/generated",
  ]),

  {
    files: [
      "**/*.ts",
    ],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]);