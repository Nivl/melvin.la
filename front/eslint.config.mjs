import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { FlatCompat } from "@eslint/eslintrc";

export default tseslint.config(
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
          project: import.meta.dirname,
        },
      },
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      next.configs.coreWebVitals,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.react,
      importPlugin.flatConfigs.typescript,

      // Keep last
      prettierPluginRecommended,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': ['error', {
        groups: [
          ['^\\u0000'],
          ['^@?\\w'],
          ['^'],
          ['^\\.', '^(backend|components|contexts|hooks|pages|utils)'],
        ],
      }],

      'import/no-default-export': 'error',
      'prettier/prettier': 'error',
      'no-console': 'error',

      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': ['error', {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  {
    files: ["src/app/**/*.tsx", "src/**/*.stories.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  }
);
