import eslint from '@eslint/js';
import eslintNextPlugin from '@next/eslint-plugin-next';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

// Uncomment when this is fixed: https://github.com/import-js/eslint-plugin-import/pull/3213
// also replace `<disabled>-eslint-disable` with `eslint-disable` in the code
// import importPlugin from 'eslint-plugin-import';

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...storybook.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,
  eslintNextPlugin.configs.recommended,
  ...nextVitals, // eslint-disable-line @typescript-eslint/no-unsafe-argument
  // Keep prettier last
  prettierPluginRecommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    // Uncomment when this is fixed: https://github.com/import-js/eslint-plugin-import/pull/3213
    // settings: {
    //   'import/resolver': {
    //     typescript: {
    //       alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
    //       project: import.meta.dirname,
    //     },
    //   },
    // },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: true,
      },
    },
    rules: {
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/prefer-math-trunc': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [String.raw`^\u0000`],
            [String.raw`^@?\w`],
            ['^'],
            [
              String.raw`^\.`,
              '^(backend|components|contexts|hooks|pages|utils)',
            ],
          ],
        },
      ],
      // Uncomment when this is fixed: https://github.com/import-js/eslint-plugin-import/pull/3213
      // 'import/no-default-export': 'error',
      'prettier/prettier': 'error',
      'no-console': 'error',

      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unnecessary-condition': 'off', // doesn't work with tsx
      '@typescript-eslint/prefer-optional-chain': 'off', // lots of false positives
    },
  },
  {
    files: ['src/app/**/*.tsx', 'src/**/*.stories.ts'],
    rules: {
      // Uncomment when this is fixed: https://github.com/import-js/eslint-plugin-import/pull/3213
      // "import/no-default-export": "off",
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['src/**/*.stories.ts'],
    rules: {
      'unicorn/no-null': 'off',
    },
  },
  { ignores: ['!.storybook'] },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/gen/**',
  ]),
);
