/**
 * WordPress dependencies
 */
import '@wordpress/block-editor';

// The bundled `@types/wordpress__block-editor` lags behind the installed runtime
// and is missing the spacing-preset helpers and `SpacingSizesControl`. Augment
// the module with the members this plugin relies on.
declare module '@wordpress/block-editor' {
	export function getSpacingPresetCssVar( value?: string ): string | undefined;
	export function isValueSpacingPreset( value?: string ): boolean;
	// Mirrors the props the component actually accepts; any other prop is
	// silently dropped, so keep this in sync with the installed version.
	// @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/spacing-sizes-control/index.js
	export const __experimentalSpacingSizesControl: React.ComponentType< {
		inputProps?: Record< string, unknown >;
		label?: string;
		minimumCustomValue?: number;
		onChange?: ( values: Record< string, string | undefined > ) => void;
		onMouseOut?: () => void;
		onMouseOver?: () => void;
		showSideInLabel?: boolean;
		sides?: string[];
		useSelect?: boolean;
		values?: Record< string, string | undefined >;
	} >;
}
