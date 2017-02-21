module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  globals: {
    $: true
  },
  extends: 'standard',
  rules: {
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', {"anonymous": "always", "named": "never", "asyncArrow": "always"}]
  }
};