import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import promisePlugin from 'eslint-plugin-promise';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEsLint, { configs as tsConfigs, parser as tsParser, plugin as tsPlugin } from 'typescript-eslint';

export default tsEsLint.config([
  eslint.configs.recommended,
  ...tsConfigs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    ignores: ['node_modules', 'dist', 'cdk/node_modules', 'cdk/cdk.out'],
  },
  {
    files: ['**/*.{ts,tsx}', '*.config.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
      },
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      promise: promisePlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      'import/no-unresolved': 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: false },
        },
      ],
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],
      ...promisePlugin.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,
    },
  },
  {
    files: ['**/*.js'],
    ...tsConfigs.disableTypeChecked,
  },
]);
