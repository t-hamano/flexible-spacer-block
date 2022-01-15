/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

import metadata from './block.json';

export default {
	from: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( { anchor, height } ) => {
				return createBlock( metadata.name, {
					anchor,
					heightLg: height,
					heightMd: height,
					heightSm: height,
				} );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( { anchor, heightLg } ) => {
				return createBlock( 'core/spacer', {
					anchor,
					height: heightLg,
				} );
			},
		},
	],
};
