/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import { getTransformedHeight } from './utils';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( {
				anchor,
				height,
				style,
			}: {
				anchor?: string;
				height?: string;
				style?: Record< string, unknown >;
			} ) => {
				const newHeight = getTransformedHeight( height );

				return createBlock( metadata.name, {
					anchor,
					style,
					heightLg: newHeight,
					heightMd: newHeight,
					heightSm: newHeight,
				} );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( {
				anchor,
				heightLg,
				style,
			}: {
				anchor?: string;
				heightLg?: string;
				style?: Record< string, unknown >;
			} ) => {
				return createBlock( 'core/spacer', {
					anchor,
					style,
					height: getTransformedHeight( heightLg ),
				} );
			},
		},
	],
};

export default transforms;
