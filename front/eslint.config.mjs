import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import storybook from 'eslint-plugin-storybook'

/*
  START COMPAT
*/

import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const compatRules = compat.extends("next/core-web-vitals")

/*
  END COMPAT
*/

export default tseslint.config(
  { ignores: ['src/gen/**', '!.storybook'] },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...storybook.configs['flat/recommended'],
  ...compatRules,
  // Keep prettier last
  prettierPluginRecommended,
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
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },
    rules: {
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
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unnecessary-condition': 'off', // doesn't work with tsx
      '@typescript-eslint/prefer-optional-chain': 'off', // lots of false positives
    },
  },
  {
    files: ["src/app/**/*.tsx", "src/**/*.stories.ts"],
    rules: {
      "import/no-default-export": "off",
      "@typescript-eslint/no-empty-function": "off",
    },
  }
);
