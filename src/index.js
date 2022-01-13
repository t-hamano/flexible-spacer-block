/**
 * WordPress dependencies
 */
import { resizeCornerNE as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const config = {
	icon,
	edit,
	save,
	transforms,
};

registerBlockType( metadata.name, config );
