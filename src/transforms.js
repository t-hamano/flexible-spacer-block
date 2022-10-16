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
				const parsedHeight = parseInt( height, 10 );
				return createBlock( metadata.name, {
					anchor,
					heightLg: parsedHeight,
					heightMd: parsedHeight,
					heightSm: parsedHeight,
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
