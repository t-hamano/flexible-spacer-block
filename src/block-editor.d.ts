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
	export const __experimentalSpacingSizesControl: React.ComponentType< {
		values?: Record< string, string | undefined >;
		onChange?: ( values: Record< string, string | undefined > ) => void;
		label?: string;
		sides?: string[];
		units?: unknown;
		allowReset?: boolean;
		splitOnAxis?: boolean;
		showSideInLabel?: boolean;
	} >;
}
