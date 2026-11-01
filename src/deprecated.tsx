/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { BlockAttributes } from './types';
import { getStyleObject } from './utils';

type V1Attributes = {
	heightLg: number;
	heightMd: number;
	heightSm: number;
	isNegativeLg: boolean;
	isNegativeMd: boolean;
	isNegativeSm: boolean;
};

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
	migrate( attributes: V1Attributes ): BlockAttributes {
		const { heightLg, heightMd, heightSm } = attributes;
		return {
			...attributes,
			heightLg: heightLg !== undefined ? `${ heightLg }px` : undefined,
			heightMd: heightMd !== undefined ? `${ heightMd }px` : undefined,
			heightSm: heightSm !== undefined ? `${ heightSm }px` : undefined,
		};
	},
	save( { attributes, className }: BlockSaveProps< V1Attributes > ) {
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

// Builds the attributes of the format that used the default values from the
// settings page as the fallback for empty heights.
function getV2Attributes( heightDefault?: string ) {
	const height = {
		type: 'string',
		...( heightDefault !== undefined && { default: heightDefault } ),
	};
	return {
		heightLg: height,
		heightMd: height,
		heightSm: height,
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
	};
}

// Stop depending on the default values from the settings page. An empty height
// was output with the default value from the settings at save time, so the
// output changed when the settings changed.
const v2 = {
	attributes: getV2Attributes( '100px' ),
	migrate( attributes: BlockAttributes ): BlockAttributes {
		const { heightLg, heightMd, heightSm } = attributes;
		const defaultValue = fsbConf.defaultValue;
		// Keep the height that was output as an explicit value.
		return {
			...attributes,
			heightLg: heightLg || defaultValue.lg + defaultValue.lg_unit,
			heightMd: heightMd || defaultValue.md + defaultValue.md_unit,
			heightSm: heightSm || defaultValue.sm + defaultValue.sm_unit,
		};
	},
	save( { attributes, className }: BlockSaveProps< BlockAttributes > ) {
		const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;
		const defaultValue = fsbConf.defaultValue;

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
	},
};

// An empty height was not saved, so it was parsed as `100px` on reload and the
// block became invalid. Parse omitted heights as empty to recover such content.
const v2WithoutHeightDefaults = {
	...v2,
	attributes: getV2Attributes(),
};

export default [ v2, v2WithoutHeightDefaults, v1 ];
