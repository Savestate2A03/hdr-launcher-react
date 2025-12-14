module.exports = {
  extends: 'erb',
  parser: '@typescript-eslint/parser',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    'no-console': 'off',
    'no-alert': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
