/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

const defaultValue = fsbConf.defaultValue;

export default function save( { attributes, className } ) {
	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

	const styleLg =
		heightLg !== undefined
			? { marginBottom: isNegativeLg ? `-${ heightLg }` : heightLg }
			: { marginBottom: `${ defaultValue.lg }px` };
	const styleMd =
		heightMd !== undefined
			? { marginBottom: isNegativeMd ? `-${ heightMd }` : heightMd }
			: { marginBottom: `${ defaultValue.md }px` };
	const styleSm =
		heightSm !== undefined
			? { marginBottom: isNegativeSm ? `-${ heightSm }` : heightSm }
			: { marginBottom: `${ defaultValue.sm }px` };

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
