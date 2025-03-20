import globals from 'globals';
import pluginJs from '@eslint/js';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
// import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
    settings: {
      'import/resolver': {
        alias: {
          extensions: ['.js', '.ts', '.tsx'],
          map: [['~', './src']],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },

  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs, ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'import/no-cycle': ['error', { maxDepth: Infinity }],
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    ignores: [
      'commitlint.config.js',
      'eslint.config.js',
      'postcss.config.mjs',
      'vite.config.js',
      'tailwind.config.js',
      'dist/', // ошибка js файла из сборки
    ],
  },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      // 'unicorn/better-regex': 'warn',
      semi: ['error', 'always'],
      'max-lines-per-function': ['error', 40],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    rules: {
      // 'unicorn/prefer-event-target': 'off',
      // 'unicorn/no-array-callback-reference': 'off',
      // 'unicorn/no-array-for-each': 'off',
      // 'unicorn/no-array-reduce': 'off',
      // 'unicorn/no-array-map': 'off',
      // 'unicorn/no-null': 'off',
      // 'unicorn/number-literal-case': 'off',
      // 'unicorn/numeric-separators-style': 'off',
      // 'unicorn/prevent-abbreviations': [
      //   'error',
      //   {
      //     allowList: {
      //       acc: true,
      //       env: true,
      //       i: true,
      //       j: true,
      //       props: true,
      //       Props: true,
      //     },
      //   },
      // ],
      'no-magic-numbers': [
        'error',
        {
          ignoreArrayIndexes: true,
          ignore: [1, -1, 0],
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
        },
      ],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'function',
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'function',
        },
        { blankLine: 'always', prev: '*', next: 'multiline-const' },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: '*', next: 'function' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',

      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/member-ordering': 'error',
      'class-methods-use-this': 'error',
    },
  },
  eslintConfigPrettier,
];
