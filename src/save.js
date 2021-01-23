/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save({
	attributes,
	className
}) {
	const {
		heightLg,
		heightMd,
		heightSm
	} = attributes;

	const blockProps = useBlockProps.save({
		'aria-hidden': true,
		className: classnames( 'rsb-responsive-spacer', className )
	});

	return (
		<div { ...blockProps } >
			<div
				className="rsb-responsive-spacer__device rsb-responsive-spacer__device--sm"
				style={{ height: heightSm }}
			/>
			<div
				className="rsb-responsive-spacer__device rsb-responsive-spacer__device--md"
				style={{ height: heightMd }}
			/>
			<div
				className="rsb-responsive-spacer__device rsb-responsive-spacer__device--lg"
				style={{ height: heightLg }}
			/>
		</div>
	);
}
