/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [ '**/node_modules/**', '**/vendor/**', '**/build/**' ],
	},
	...defaultConfig.configs.recommended,
	{
		languageOptions: {
			globals: {
				fsbConf: true,
			},
		},
		rules: {
			'react/jsx-boolean-value': 'error',
			'react/jsx-curly-brace-presence': [ 'error', { props: 'never', children: 'never' } ],
			'import/no-extraneous-dependencies': 'off',
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
	},
	...defaultConfig.configs[ 'test-e2e' ].map( ( config ) => ( {
		...config,
		files: [ 'test/e2e/**/*.{js,ts}' ],
		rules: {
			...config.rules,
			'jest/expect-expect': 'off',
			'react-hooks/rules-of-hooks': 'off',
		},
	} ) ),
];
