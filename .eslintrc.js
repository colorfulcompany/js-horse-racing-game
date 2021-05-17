module.exports = {
  env: {
    es2021: true,
    browser: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021
  },
  plugins: [
    '@babel',
    'jsdoc'
  ],
  extends: [
    'standard',
    'plugin:jsdoc/recommended'
  ],
  rules: {
    'arrow-parens': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-returns-description': 'off'
  }
}
