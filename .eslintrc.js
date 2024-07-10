module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  globals: { // https://eslint.org/docs/user-guide/configuring#specifying-globals
    App: true
  },
  env: {
    browser: true
  },
  extends: 'standard', // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  rules: { // add your custom rules here
    'prefer-const': 0,
		'comma-dangle': ["error", {
			"arrays": "always-multiline",
			"objects": "always-multiline",
			"imports": "always-multiline",
			"exports": "always-multiline",
			"functions": "never"
	}],
    'eqeqeq': 0,
    'semi': [2, 'always'],
    'no-multi-str': 0,
    'no-unused-vars': 0,
    'no-useless-escape': 0,
    'no-undef': 0,
    'no-multi-spaces': ["error", { ignoreEOLComments: false }],
    'quotes': 0,
    'camelcase': 0,
    'arrow-parens': 0, // allow paren-less arrow functions
    'generator-star-spacing': 0, // allow async-await
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0 // allow debugger during development
  }
}
