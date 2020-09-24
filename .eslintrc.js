// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'space-before-function-paren': 'off',
    'semi': 'off',
    'indent': 'off',
    'arrow-spacing': 'off',
    'eol-last': 'off',
    'comma-dangle': 'off',
    'quotes': 'off',
    'comma-spacing': 'off',
    'comma-dangle': 'off',
    'valid-v-for': 'off',
    'no-unused-vars': 'off',
    'padded-blocks': 'off',
    'no-tabs': 'off',
    'spaced-comment': 'off',
    'space-infix-ops': 'off',
    'operator-linebreak': 'off',
    'operator-linebreak': 'off',
    'object-property-newline': 'off',
    'no-return-await': 'off',
    'no-multiple-empty-lines': 'off',
    'no-extra-parens': 'off',
    'key-spacing': 'off',
    'require-v-for-key': 'off',


    // npm install --save less-loader
    // allow debugger during development
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off'
  }
}
