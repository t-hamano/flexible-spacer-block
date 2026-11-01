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

const defaultValue = fsbConf.defaultValue;

export default function save( { attributes, className }: BlockSaveProps< BlockAttributes > ) {
	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

	const styleLg = getStyleObject( heightLg, isNegativeLg, defaultValue.lg, defaultValue.lg_unit );
	const styleMd = getStyleObject( heightMd, isNegativeMd, defaultValue.md, defaultValue.md_unit );
	const styleSm = getStyleObject( heightSm, isNegativeSm, defaultValue.sm, defaultValue.sm_unit );

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
