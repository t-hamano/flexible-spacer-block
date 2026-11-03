/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { BlockAttributes } from './types';
import { getStyleObject } from './utils';
import { DEFAULT_SPACER_HEIGHT, DEFAULT_SPACER_HEIGHT_UNIT } from './constants';

export default function save( { attributes, className }: BlockSaveProps< BlockAttributes > ) {
	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

	// Use the block defaults rather than the settings page values, so that the
	// output does not change when the settings change.
	const styleLg = getStyleObject(
		heightLg,
		isNegativeLg,
		String( DEFAULT_SPACER_HEIGHT ),
		DEFAULT_SPACER_HEIGHT_UNIT
	);
	const styleMd = getStyleObject(
		heightMd,
		isNegativeMd,
		String( DEFAULT_SPACER_HEIGHT ),
		DEFAULT_SPACER_HEIGHT_UNIT
	);
	const styleSm = getStyleObject(
		heightSm,
		isNegativeSm,
		String( DEFAULT_SPACER_HEIGHT ),
		DEFAULT_SPACER_HEIGHT_UNIT
	);

	const blockProps = useBlockProps.save( {
		'aria-hidden': true,
		className: clsx( 'fsb-flexible-spacer', className ),
	} );

	return (
		<div { ...blockProps }>
			<div
				className="fsb-flexible-spacer__device fsb-flexible-spacer__device--lg"
				style={ styleLg }
			/>
			<div
				className="fsb-flexible-spacer__device fsb-flexible-spacer__device--md"
				style={ styleMd }
			/>
			<div
				className="fsb-flexible-spacer__device fsb-flexible-spacer__device--sm"
				style={ styleSm }
			/>
		</div>
	);
}
