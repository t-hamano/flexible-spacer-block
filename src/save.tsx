/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	getSpacingPresetCssVar,
	isValueSpacingPreset,
} from '@wordpress/block-editor';
import { __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue } from '@wordpress/components';
import type { BlockSaveProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { BlockAttributes } from './types';

const defaultValue = fsbConf.defaultValue;

// Builds the inline style for one device. Resolves spacing presets to their CSS
// var, applies negative space as a negative `margin-bottom`, and falls back to
// the device default when no value is set.
function getStyleObject(
	value: string | undefined,
	isNegative: boolean,
	defaultQuantity: string,
	defaultUnit: string
): React.CSSProperties {
	// Return default value if the value is falsy.
	if ( ! value ) {
		return isNegative
			? { marginBottom: `-${ defaultQuantity }${ defaultUnit }` }
			: { height: `${ defaultQuantity }${ defaultUnit }` };
	}

	// Spacing preset reference (e.g. `var:preset|spacing|50`). Convert it to
	// its CSS custom property (e.g. `var(--wp--preset--spacing--50)`).
	if ( isValueSpacingPreset( value ) ) {
		const cssVar = getSpacingPresetCssVar( value );
		return isNegative ? { marginBottom: `calc(-1 * ${ cssVar })` } : { height: cssVar };
	}

	// If the value is 0, returns 0 regardless of whether it is negative space or not
	const [ parsedQuantity, parsedUnit ] = parseQuantityAndUnitFromRawValue( value );

	if ( parsedQuantity === 0 ) {
		return { height: `${ parsedQuantity }${ parsedUnit }` };
	}

	return isNegative ? { marginBottom: `-${ value }` } : { height: value };
}

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
