/**
 * WordPress dependencies
 */
import '@wordpress/block-editor';

// The bundled `@types/wordpress__block-editor` lags behind the installed runtime
// and is missing the spacing-preset helpers and `SpacingSizesControl`. Augment
// the module with the members this plugin relies on.
declare module '@wordpress/block-editor' {
	// Set by the editor from the theme's `settings.spacing.customSpacingSize`.
	interface EditorSettings {
		disableCustomSpacingSizes?: boolean;
	}
	export function getSpacingPresetCssVar( value?: string ): string | undefined;
	export function isValueSpacingPreset( value?: string ): boolean;
	// Only the props this plugin passes; unknown props are dropped silently.
	// @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/spacing-sizes-control/index.js
	export const __experimentalSpacingSizesControl: React.ComponentType< {
		label: string;
		onChange: ( values: Record< string, string | undefined > ) => void;
		// Both are fired on focus and blur as well as on the pointer events.
		onMouseOut?: () => void;
		onMouseOver?: () => void;
		showSideInLabel: boolean;
		sides: string[];
		values: Record< string, string | undefined >;
	} >;
}
