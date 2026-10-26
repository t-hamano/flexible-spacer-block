/**
 * External dependencies
 */
import { createRequire } from 'node:module';
import { defineConfig } from 'vitest/config';

const require = createRequire( import.meta.url );
const blockEditorPath = require.resolve( '@wordpress/block-editor/package.json' );

export default defineConfig( {
	plugins: [
		{
			// In the browser, each WordPress package is a single global. npm installs
			// several copies of some packages, and packages such as hooks and
			// private-apis keep module-level state, so resolve every WordPress package
			// from the block editor to load one copy of each.
			name: 'dedupe-wordpress-packages',
			enforce: 'pre',
			resolveId( source, importer, options ) {
				if ( ! source.startsWith( '@wordpress/' ) || importer === blockEditorPath ) {
					return null;
				}
				return this.resolve( source, blockEditorPath, { ...options, skipSelf: true } );
			},
		},
	],
	// The tsconfig preserves JSX for the build, so transform it here.
	oxc: {
		jsx: { runtime: 'automatic' },
	},
	test: {
		environment: 'jsdom',
		include: [ 'test/integration/**/*.test.ts' ],
		setupFiles: [ 'test/integration/setup.ts' ],
		server: {
			deps: {
				// WordPress packages import JSON without import attributes, so let Vite transform them.
				inline: [ /@wordpress\// ],
			},
		},
	},
} );
