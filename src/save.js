/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue } from '@wordpress/components';

const defaultValue = fsbConf.defaultValue;

export default function save( { attributes, className } ) {
	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

	function getStyleObject( value, isNegative, defaultQuantity, defaultUnit ) {
		// Return default value if the value is falsy.
		if ( value === undefined ) {
			return isNegative
				? { marginBottom: `-${ defaultQuantity }${ defaultUnit }` }
				: { height: `${ defaultQuantity }${ defaultUnit }` };
		}

		// If the value is 0, returns 0 regardless of whether it is negative space or not
		const [ parsedQuantity, parsedUnit ] = parseQuantityAndUnitFromRawValue( value );

		if ( parsedQuantity === 0 ) {
			return { height: `${ parsedQuantity }${ parsedUnit }` };
		}

		return isNegative ? { marginBottom: `-${ value }` } : { height: value };
	}

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
