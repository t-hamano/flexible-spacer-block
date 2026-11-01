/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
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

const defaultValue = fsbConf.defaultValue;

registerBlockType< BlockAttributes >( metadata as BlockConfiguration< BlockAttributes >, {
	icon,
	edit,
	save,
	transforms: transforms as BlockConfiguration< BlockAttributes >[ 'transforms' ],
	deprecated: deprecated as unknown as BlockConfiguration< BlockAttributes >[ 'deprecated' ],
	// Apply the default values from the settings page only when the block is
	// inserted, so that existing blocks are never rewritten.
	variations: [
		{
			name: 'default',
			title: __( 'Flexible Spacer', 'flexible-spacer-block' ),
			isDefault: true,
			scope: [ 'inserter' ],
			attributes: {
				heightLg: defaultValue.lg + defaultValue.lg_unit,
				heightMd: defaultValue.md + defaultValue.md_unit,
				heightSm: defaultValue.sm + defaultValue.sm_unit,
				isNegativeLg: false,
				isNegativeMd: false,
				isNegativeSm: false,
			},
		},
	],
} );
