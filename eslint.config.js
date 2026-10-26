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
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
		languageOptions: {
			globals: {
				fsbConf: true,
			},
		},
		rules: {
			'react/jsx-boolean-value': 'error',
			'react/jsx-curly-brace-presence': [ 'error', { props: 'never', children: 'never' } ],
			'jsdoc/escape-inline-tags': 'error',
			'@wordpress/wp-global-usage': 'error',
			'import/no-extraneous-dependencies': 'off',
			'@wordpress/dependency-group': 'error',
			'@wordpress/no-unsafe-wp-apis': 'off',
			'@wordpress/use-recommended-components': [ 'error', { allowUseWithCaution: true } ],
			'@wordpress/use-import-as': [
				'error',
				{
					'@wordpress/block-editor': {
						__experimentalSpacingSizesControl: 'SpacingSizesControl',
					},
					'@wordpress/components': {
						__experimentalParseQuantityAndUnitFromRawValue: 'parseQuantityAndUnitFromRawValue',
						__experimentalToolsPanel: 'ToolsPanel',
						__experimentalToolsPanelItem: 'ToolsPanelItem',
					},
				},
			],
			'@wordpress/i18n-text-domain': [
				'error',
				{
					allowedTextDomain: 'flexible-spacer-block',
				},
			],
		},
	},
	{
		files: [ '**/*.ts', '**/*.tsx' ],
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: false,
				},
			],
			'@typescript-eslint/no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'react',
							message: 'Please use React API through `@wordpress/element` instead.',
							allowTypeImports: true,
						},
					],
				},
			],
		},
	},
	...defaultConfig.configs[ 'test-playwright' ].map( ( config ) => ( {
		...config,
		files: [ 'test/e2e/**/*.ts' ],
	} ) ),
];
