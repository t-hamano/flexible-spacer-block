/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { isValueSpacingPreset } from '@wordpress/block-editor';
import { __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { DEFAULT_SPACER_HEIGHT, DEFAULT_SPACER_HEIGHT_UNIT } from './constants';
import metadata from './block.json';

function getTransformedHeight( height?: string ): string {
	if ( height && isValueSpacingPreset( height ) ) {
		return height;
	}

	const [ parsedQuantity = DEFAULT_SPACER_HEIGHT, parsedUnit = DEFAULT_SPACER_HEIGHT_UNIT ] =
		parseQuantityAndUnitFromRawValue( height );

	return `${ parsedQuantity }${ parsedUnit }`;
}

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
