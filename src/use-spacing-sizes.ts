/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSettings } from '@wordpress/block-editor';

/**
 * `useSpacingSizes` is only exposed through the block editor's private APIs, so
 * its logic is reimplemented here on top of the public `useSettings` hook.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/spacing-sizes-control/hooks/use-spacing-sizes.js
 */

export type SpacingSize = {
	name: string;
	slug: string;
	size: number | string | undefined;
};

const RANGE_CONTROL_MAX_SIZE = 8;

const EMPTY_ARRAY: SpacingSize[] = [];

const compare = new Intl.Collator( 'und', { numeric: true } ).compare;

export default function useSpacingSizes(): SpacingSize[] {
	const [ customSpacingSizes, themeSpacingSizes, defaultSpacingSizes, defaultSpacingSizesEnabled ] =
		useSettings(
			'spacing.spacingSizes.custom',
			'spacing.spacingSizes.theme',
			'spacing.spacingSizes.default',
			'spacing.defaultSpacingSizes'
		);

	const customSizes: SpacingSize[] = customSpacingSizes ?? EMPTY_ARRAY;
	const themeSizes: SpacingSize[] = themeSpacingSizes ?? EMPTY_ARRAY;
	const defaultSizes: SpacingSize[] =
		defaultSpacingSizes && defaultSpacingSizesEnabled !== false ? defaultSpacingSizes : EMPTY_ARRAY;

	return useMemo( () => {
		const sizes: SpacingSize[] = [
			{ name: __( 'None', 'flexible-spacer-block' ), slug: '0', size: 0 },
			...customSizes,
			...themeSizes,
			...defaultSizes,
		];

		// Using numeric slugs opts-in to sorting by slug.
		if ( sizes.every( ( { slug } ) => /^[0-9]/.test( slug ) ) ) {
			sizes.sort( ( a, b ) => compare( a.slug, b.slug ) );
		}

		return sizes.length > RANGE_CONTROL_MAX_SIZE
			? [
					{ name: __( 'Default', 'flexible-spacer-block' ), slug: 'default', size: undefined },
					...sizes,
			  ]
			: sizes;
	}, [ customSizes, themeSizes, defaultSizes ] );
}
