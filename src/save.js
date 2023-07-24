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

	const styleLg = isNegativeLg
		? {
				marginBottom:
					heightLg === undefined
						? `-${ defaultValue.lg }${ defaultValue.lg_unit }`
						: `-${ heightLg }`,
		  }
		: {
				height: heightLg === undefined ? `${ defaultValue.lg }${ defaultValue.lg_unit }` : heightLg,
		  };

	const styleMd = isNegativeMd
		? {
				marginBottom:
					heightMd === undefined
						? `-${ defaultValue.md }${ defaultValue.md_unit }`
						: `-${ heightMd }`,
		  }
		: {
				height: heightMd === undefined ? `${ defaultValue.md }${ defaultValue.md_unit }` : heightMd,
		  };

	const styleSm = isNegativeSm
		? {
				marginBottom:
					heightSm === undefined
						? `-${ defaultValue.sm }${ defaultValue.sm_unit }`
						: `-${ heightSm }`,
		  }
		: {
				height: heightSm === undefined ? `${ defaultValue.sm }${ defaultValue.sm_unit }` : heightSm,
		  };

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
