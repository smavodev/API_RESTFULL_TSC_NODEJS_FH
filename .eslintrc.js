module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './tsconfig.test.json'],
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  overrides: [],
  rules: {
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
  },
}
