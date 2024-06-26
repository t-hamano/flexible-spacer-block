/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

// Add unit support
const v1 = {
	attributes: {
		heightLg: {
			type: 'number',
			default: 100,
		},
		heightMd: {
			type: 'number',
			default: 100,
		},
		heightSm: {
			type: 'number',
			default: 100,
		},
		isNegativeLg: {
			type: 'boolean',
			default: false,
		},
		isNegativeMd: {
			type: 'boolean',
			default: false,
		},
		isNegativeSm: {
			type: 'boolean',
			default: false,
		},
	},
	migrate( attributes ) {
		const { heightLg, heightMd, heightSm } = attributes;
		return {
			...attributes,
			heightLg: heightLg !== undefined ? `${ heightLg }px` : undefined,
			heightMd: heightMd !== undefined ? `${ heightMd }px` : undefined,
			heightSm: heightSm !== undefined ? `${ heightSm }px` : undefined,
		};
	},
	save( { attributes, className } ) {
		const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

		const styleLg = isNegativeLg ? { marginBottom: -heightLg } : { height: heightLg };
		const styleMd = isNegativeMd ? { marginBottom: -heightMd } : { height: heightMd };
		const styleSm = isNegativeSm ? { marginBottom: -heightSm } : { height: heightSm };

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
	},
};

export default [ v1 ];
