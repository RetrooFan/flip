module.exports = {
  parserOptions: {
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  env: {
    node: true,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
  },
};
