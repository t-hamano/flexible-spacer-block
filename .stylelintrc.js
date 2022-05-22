module.exports = {
	extends: [
		'@wordpress/stylelint-config/scss',
		'stylelint-config-recess-order',
	],
	rules: {
		'no-descending-specificity': null,
		'selector-class-pattern': null,
		'font-weight-notation': null,
	}
}
