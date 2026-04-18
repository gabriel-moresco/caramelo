/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    es2021: true,
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:drizzle/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'drizzle'],
  rules: {
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'multiline-ternary': 0,
    '@typescript-eslint/no-empty-interface': 'off',
    camelcase: 'off',

    'drizzle/enforce-delete-with-where': 'off',
  },
}
