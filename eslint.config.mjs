// @ts-check
import eslint from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'api-docs/**', 'coverage/**', 'dist/**'],
  },

  // ── TypeScript ─────────────────────────────────────────────────────────────
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      eslintPluginPrettierRecommended,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'max-len': ['error', 150],
      'newline-before-return': 'error',
      'no-multiple-empty-lines': ['error'],
      'prettier/prettier': ['error', { endOfLine: 'lf' }],
    },
  },

  // ── JSON ───────────────────────────────────────────────────────────────────
  {
    ...json.configs.recommended,
    files: ['**/*.json'],
    language: 'json/json',
  },

  // ── Markdown ───────────────────────────────────────────────────────────────
  ...markdown.configs.recommended,
);
