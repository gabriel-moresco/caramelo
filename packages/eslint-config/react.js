/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:@tanstack/eslint-plugin-router/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'simple-import-sort'],
  settings: {
    react: {
      version: 'detect',
    },
  },
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

    'react/prop-types': [0],
    'react/display-name': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
