module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'plugin:react-app/recommended'],
  plugins: ['react-native', 'prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': 0,
    curly: 'warn',
    'react-app/jsx-a11y/href-no-hash': 'off',
    'react-app/import/first': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    // 'prettier/prettier': ['error']
    code: 80
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
};
