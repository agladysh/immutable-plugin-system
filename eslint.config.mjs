import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintComments from 'eslint-plugin-eslint-comments';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: { projectService: true },
    },
    plugins: {
      'eslint-comments': eslintComments,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
      noInlineConfig: false,
    },
    rules: {
      // treat all warnings as errors
      'no-warning-comments': ['error', { terms: ['todo', 'fixme'] }],
      // require braces for all control statements
      curly: ['error', 'all'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // Disallow disabling explicit-any via ESLint comments
      'eslint-comments/no-restricted-disable': [
        'error',
        '@typescript-eslint/no-explicit-any',
      ],
    },
  },
  {
    files: ['test-d/**/*.ts'],
    languageOptions: {
      // Do not require TS project for tsd tests; lint syntactically only
      parserOptions: { projectService: false },
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
);
