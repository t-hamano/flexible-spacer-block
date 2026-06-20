/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { DEFAULT_SPACER_HEIGHT, DEFAULT_SPACER_HEIGHT_UNIT } from './constants';
import metadata from './block.json';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( { anchor, height }: { anchor?: string; height?: string } ) => {
				const [ parsedQuantity = DEFAULT_SPACER_HEIGHT, parsedUnit = DEFAULT_SPACER_HEIGHT_UNIT ] =
					parseQuantityAndUnitFromRawValue( height );
				const newHeight = `${ parsedQuantity }${ parsedUnit }`;

				return createBlock( metadata.name, {
					anchor,
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
			transform: ( { anchor, heightLg }: { anchor?: string; heightLg?: string } ) => {
				const [ parsedQuantity = DEFAULT_SPACER_HEIGHT, parsedUnit = DEFAULT_SPACER_HEIGHT_UNIT ] =
					parseQuantityAndUnitFromRawValue( heightLg );
				const newHeight = `${ parsedQuantity }${ parsedUnit }`;
				return createBlock( 'core/spacer', {
					anchor,
					height: newHeight,
				} );
			},
		},
	],
};

export default transforms;
