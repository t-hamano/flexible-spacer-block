/**
 * WordPress dependencies
 */
import { getSpacingPresetCssVar, isValueSpacingPreset } from '@wordpress/block-editor';
import { __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { DEFAULT_SPACER_HEIGHT, DEFAULT_SPACER_HEIGHT_UNIT } from './constants';

// Builds the inline style for one device. Resolves spacing presets to their CSS
// var, applies negative space as a negative `margin-bottom`, and falls back to
// the device default when no value is set.
export function getStyleObject(
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

	// The "None" preset is stored as a bare `0`, which `isValueSpacingPreset()`
	// reports as a preset even though it has no CSS var. Treat it as zero.
	if ( value === '0' ) {
		return { height: '0px' };
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

// Converts a height between this block and the core Spacer block. Keeps spacing
// presets as they are, and fills in the default quantity or unit when missing.
export function getTransformedHeight( height?: string ): string {
	if ( height && isValueSpacingPreset( height ) ) {
		return height;
	}

	const [ parsedQuantity = DEFAULT_SPACER_HEIGHT, parsedUnit = DEFAULT_SPACER_HEIGHT_UNIT ] =
		parseQuantityAndUnitFromRawValue( height );

	return `${ parsedQuantity }${ parsedUnit }`;
}
