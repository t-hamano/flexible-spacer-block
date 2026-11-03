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

// When a height was cleared, it was empty and therefore not saved, while the save
// function output it with the default value from the settings page
// (`fsbConf.defaultValue`). On reload the height was parsed as `100px`, so the
// block became invalid when that default value was not 100px. This version parses
// omitted heights as empty to match such content, and writes the default value
// back to them so that the block keeps the height it was shown with.
const v2 = {
	attributes: {
		heightLg: {
			type: 'string',
		},
		heightMd: {
			type: 'string',
		},
		heightSm: {
			type: 'string',
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
	migrate( attributes: BlockAttributes ): BlockAttributes {
		const { heightLg, heightMd, heightSm } = attributes;
		const { defaultValue } = fsbConf;
		return {
			...attributes,
			heightLg: heightLg || defaultValue.lg + defaultValue.lg_unit,
			heightMd: heightMd || defaultValue.md + defaultValue.md_unit,
			heightSm: heightSm || defaultValue.sm + defaultValue.sm_unit,
		};
	},
	save( { attributes, className }: BlockSaveProps< BlockAttributes > ) {
		const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;
		const { defaultValue } = fsbConf;

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

// Stop depending on the default values from the settings page in the save
// function. This version is the same as v2 except that omitted heights are parsed
// as `100px`, as in the block.json of that time. It recovers content that was
// valid at that time, such as a height saved as an empty string.
const v3 = {
	...v2,
	attributes: {
		...v2.attributes,
		heightLg: {
			type: 'string',
			default: '100px',
		},
		heightMd: {
			type: 'string',
			default: '100px',
		},
		heightSm: {
			type: 'string',
			default: '100px',
		},
	},
};

export default [ v3, v2, v1 ];
