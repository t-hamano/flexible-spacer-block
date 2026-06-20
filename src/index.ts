/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import type { BlockConfiguration } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';
import './store';
import { blockIcon as icon } from './icons';
import type { BlockAttributes } from './types';

registerBlockType< BlockAttributes >( metadata as BlockConfiguration< BlockAttributes >, {
	icon,
	edit,
	save,
	// `transforms` and `deprecated` carry callback signatures (e.g. `transform`,
	// `migrate`) that are intentionally narrower than the loose types expected by
	// `registerBlockType`, so they are cast at this boundary.
	transforms: transforms as BlockConfiguration< BlockAttributes >[ 'transforms' ],
	deprecated: deprecated as unknown as BlockConfiguration< BlockAttributes >[ 'deprecated' ],
} );
