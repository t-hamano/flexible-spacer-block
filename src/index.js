/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

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

const config = {
	icon,
	edit,
	save,
	transforms,
	deprecated,
};

registerBlockType( metadata.name, config );
