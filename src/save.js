/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes, className } ) {
	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

	const styleLg = isNegativeLg ? { marginBottom: -heightLg } : { height: heightLg };
	const styleMd = isNegativeMd ? { marginBottom: -heightMd } : { height: heightMd };
	const styleSm = isNegativeSm ? { marginBottom: -heightSm } : { height: heightSm };

	const blockProps = useBlockProps.save( {
		'aria-hidden': true,
		className: classnames( 'fsb-flexible-spacer', className ),
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
