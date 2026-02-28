module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	parser: '@babel/eslint-parser',
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'react/jsx-boolean-value': 'error',
		'react/jsx-curly-brace-presence': [ 'error', { props: 'never', children: 'never' } ],
		'import/no-unresolved': 'off',
		'@wordpress/dependency-group': 'error',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'@wordpress/no-setting-ds-tokens': 'off',
		'@wordpress/no-unknown-ds-tokens': 'off',
		'@wordpress/i18n-text-domain': [
			'error',
			{
				allowedTextDomain: 'flexible-spacer-block',
			},
		],
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				tabWidth: 2,
				singleQuote: true,
				printWidth: 100,
				bracketSpacing: true,
				parenSpacing: true,
				bracketSameLine: false,
			},
		],
	},
	globals: {
		fsbConf: true,
	},
	parserOptions: {
		requireConfigFile: false,
		babelOptions: {
			presets: [ '@babel/preset-react' ],
		},
	},
	overrides: [
		{
			files: [ '**/test/**/*.js', '**/__tests__/**/*.js', '**/*.spec.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-unit' ],
			settings: {
				jest: {
					version: 26,
				},
			},
		},
		{
			files: [ 'test/e2e/**/*.js' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-e2e' ],
			rules: {
				'jest/expect-expect': 'off',
			},
		},
	],
};
