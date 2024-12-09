import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "plugin:prettier/recommended",
    "prettier",
)), {
    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        "simple-import-sort": simpleImportSort,
        prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",

        parserOptions: {
            project: ["tsconfig.json"],
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "simple-import-sort/imports": ["error", {
            groups: [
                ["^\\u0000"],
                ["^@?\\w"],
                ["^"],
                ["^\\.", "^(backend|components|contexts|hooks|pages|utils)"],
            ],
        }],

        "simple-import-sort/exports": ["error"],
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "prettier/prettier": "error",
        "no-console": "error",

        "@typescript-eslint/no-unused-vars": ["error", {
            "args": "all",
            "argsIgnorePattern": "^_",
            "caughtErrors": "all",
            "caughtErrorsIgnorePattern": "^_",
            "destructuredArrayIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "ignoreRestSiblings": true
        }],

        "import/no-default-export": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-misused-promises": "error",
    },
}, {
    files: ["src/app/**/*.tsx", "src/**/*.stories.ts"],

    rules: {
        "import/no-default-export": "off",
    },
}];
