/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	// Build the stylesheets that are not imported from JavaScript as their own entries,
	// so that all assets are output to the build directory in one pass.
	entry: () => ( {
		...defaultConfig.entry(),
		'admin-style': './src/admin-style.scss',
		'editor-style': './src/editor-style.scss',
	} ),
};
