module.exports = {
	extends: [
		'@wordpress/stylelint-config/scss',
		'stylelint-config-recess-order',
	],
  ignoreFiles: [
		'build/**/*.css',
		'node_modules/**/*.css',
		'vendor/**/*.css',
		'**/*.js',
		'**/*.svg',
		'.stylelintrc.js'
  ],
	rules: {
		'no-descending-specificity': null,
		'function-calc-no-invalid': null,
		'selector-class-pattern': null,
		'font-weight-notation': null,
	}
}
