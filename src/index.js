/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { resizeCornerNE as icon } from '@wordpress/icons';
import {
	registerBlockType,
	unstable__bootstrapServerSideBlockDefinitions // eslint-disable-line camelcase
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name } = metadata;

const settings = {
	title: __( 'Flexible Spacer', 'flexible-spacer-block' ),
	description: __( 'Add white space between blocks and customize its height for each device.', 'flexible-spacer-block' ),
	icon,
	edit,
	save,
	transforms
};

if ( metadata ) {
	unstable__bootstrapServerSideBlockDefinitions({ [ name ]: metadata });
}

registerBlockType( name, settings );
