/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ResizableBox, RangeControl, Dashicon } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { View } from '@wordpress/primitives';

/**
 * Internal dependencies
 */
import { getWPAdminURL } from './helper';

const MIN_SPACER_HEIGHT = 1;
const MAX_SPACER_HEIGHT = 500;
const SPACER_HEIGHT_ALL = 100;

export default function edit({
	attributes,
	isSelected,
	setAttributes,
	toggleSelection
}) {
	const [ heightAll, setHeightAll ] = useState( SPACER_HEIGHT_ALL );
	const [ isResizingLg, setIsResizingLg ] = useState( false );
	const [ isResizingMd, setIsResizingMd ] = useState( false );
	const [ isResizingSm, setIsResizingSm ] = useState( false );

	const isEnableMd = parseInt( rsbConf.breakpoint.md ) !== parseInt( rsbConf.breakpoint.sm );
	const isShowBlock  = rsbConf.showBlock;

	const {
		heightLg,
		heightMd,
		heightSm
	} = attributes;

	const settingUrl = getWPAdminURL( 'options-general.php', {
		page: 'responsive-spacer-block-option'
	});

	const blockProps = useBlockProps({
		className: classnames( 'rsb-responsive-spacer', {
			[ 'rsb-responsive-spacer--is-show-block' ]: !! isShowBlock
		})
	});

	const updateHeightAll = ( value ) => {
		setAttributes({
			heightLg: value,
			heightMd: value,
			heightSm: value
		});
		setHeightAll( value );
	};

	const updateHeightLg = ( value ) => {
		setAttributes({ heightLg: value });
		if ( ! isEnableMd ) {
			setAttributes({ heightMd: value });
		}
	};
	const updateHeightMd = ( value ) => setAttributes({ heightMd: value });
	const updateHeightSm = ( value ) => setAttributes({ heightSm: value });

	const handleOnResizeStartLg = ( ...args ) => {
		setIsResizingLg( true );
		toggleSelection( false );
	};

	const handleOnResizeStartMd = ( ...args ) => {
		setIsResizingMd( true );
		toggleSelection( false );
	};

	const handleOnResizeStartSm = ( ...args ) => {
		setIsResizingSm( true );
		toggleSelection( false );
	};

	const handleOnResizeStopLg = ( event, direction, elt, delta ) => {
		const spacerHeightLg = Math.min(
			parseInt( heightLg + delta.height, 10 ),
			MAX_SPACER_HEIGHT
		);
		updateHeightLg( spacerHeightLg );
		setIsResizingLg( false );
	};

	const handleOnResizeStopMd = ( event, direction, elt, delta ) => {
		const spacerHeightMd = Math.min(
			parseInt( heightMd + delta.height, 10 ),
			MAX_SPACER_HEIGHT
		);
		updateHeightMd( spacerHeightMd );
		setIsResizingMd( false );
	};

	const handleOnResizeStopSm = ( event, direction, elt, delta ) => {
		const spacerHeightSm = Math.min(
			parseInt( heightSm + delta.height, 10 ),
			MAX_SPACER_HEIGHT
		);
		updateHeightSm( spacerHeightSm );
		setIsResizingSm( false );
	};

	return (
		<>
			<View { ...blockProps }>
				<div className="rsb-responsive-spacer__inner">
					<div className="rsb-responsive-spacer__breakpoint">
						<div className=" rsb-responsive-spacer__breakpoint-item">&le; { rsbConf.breakpoint.sm }px &lt;</div>
						{ isEnableMd && (
							<div className=" rsb-responsive-spacer__breakpoint-item">&le; { rsbConf.breakpoint.md }px &lt;</div>
						) }
					</div>
					<div className="rsb-responsive-spacer__device">
						<div className="rsb-responsive-spacer__device-ttl">
							<Dashicon icon="smartphone" />{ __( 'Mobile', 'responsive-spacer-block' ) }
						</div>
						<ResizableBox
							className={ classnames(
								'block-library-spacer__resize-container',
								{
									'is-selected': isSelected
								}
							) }
							size={ { height: heightSm } }
							minHeight={ MIN_SPACER_HEIGHT }
							enable={ {
								top: false,
								right: false,
								bottom: true,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false
							} }
							onResizeStart={ handleOnResizeStartSm }
							onResizeStop={ handleOnResizeStopSm }
							showHandle={ isSelected }
							__experimentalShowTooltip={ true }
							__experimentalTooltipProps={ {
								axis: 'y',
								position: 'bottom',
								isVisible: isResizingSm
							} }
						/>
					</div>
					{ isEnableMd && (
						<div className="rsb-responsive-spacer__device">
							<div className="rsb-responsive-spacer__device-ttl">
								<Dashicon icon="tablet" />{ __( 'Tablet', 'responsive-spacer-block' ) }
							</div>
							<ResizableBox
								className={ classnames(
									'block-library-spacer__resize-container',
									{
										'is-selected': isSelected
									}
								) }
								size={ { height: heightMd } }
								minHeight={ MIN_SPACER_HEIGHT }
								enable={ {
									top: false,
									right: false,
									bottom: true,
									left: false,
									topRight: false,
									bottomRight: false,
									bottomLeft: false,
									topLeft: false
								} }
								onResizeStart={ handleOnResizeStartMd }
								onResizeStop={ handleOnResizeStopMd }
								showHandle={ isSelected }
								__experimentalShowTooltip={ true }
								__experimentalTooltipProps={ {
									axis: 'y',
									position: 'bottom',
									isVisible: isResizingMd
								} }
							/>
						</div>
					) }
					<div className="rsb-responsive-spacer__device">
						<div className="rsb-responsive-spacer__device-ttl">
							<Dashicon icon="desktop" />{ __( 'Desktop', 'responsive-spacer-block' ) }
						</div>
						<ResizableBox
							className={ classnames(
								'block-library-spacer__resize-container',
								{
									'is-selected': isSelected
								}
							) }
							size={ { height: heightLg } }
							minHeight={ MIN_SPACER_HEIGHT }
							enable={ {
								top: false,
								right: false,
								bottom: true,
								left: false,
								topRight: false,
								bottomRight: false,
								bottomLeft: false,
								topLeft: false
							} }
							onResizeStart={ handleOnResizeStartLg }
							onResizeStop={ handleOnResizeStopLg }
							showHandle={ isSelected }
							__experimentalShowTooltip={ true }
							__experimentalTooltipProps={ {
								axis: 'y',
								position: 'bottom',
								isVisible: isResizingLg
							} }
						/>
					</div>
				</div>
			</View>
			<InspectorControls>
				<PanelBody title={ __( 'Spacer settings', 'responsive-spacer-block' ) }>
					<RangeControl
						label={ __( 'Height in pixels (All)', 'responsive-spacer-block' ) }
						beforeIcon="editor-ul"
						min={ MIN_SPACER_HEIGHT }
						max={ Math.max( MAX_SPACER_HEIGHT, heightAll ) }
						value={ heightAll }
						onChange={ updateHeightAll }
					/>
					<RangeControl
						label={ __( 'Height in pixels (Desktop)', 'responsive-spacer-block' ) }
						beforeIcon="desktop"
						min={ MIN_SPACER_HEIGHT }
						max={ Math.max( MAX_SPACER_HEIGHT, heightLg ) }
						value={ heightLg }
						onChange={ updateHeightLg }
					/>
					{ isEnableMd && (
						<RangeControl
							label={ __( 'Height in pixels (Tablet)', 'responsive-spacer-block' ) }
							beforeIcon="tablet"
							min={ MIN_SPACER_HEIGHT }
							max={ Math.max( MAX_SPACER_HEIGHT, heightMd ) }
							value={ heightMd }
							onChange={ updateHeightMd }
						/>
					) }
					<RangeControl
						label={ __( 'Height in pixels (Mobile)', 'responsive-spacer-block' ) }
						beforeIcon="smartphone"
						min={ MIN_SPACER_HEIGHT }
						max={ Math.max( MAX_SPACER_HEIGHT, heightSm ) }
						value={ heightSm }
						onChange={ updateHeightSm }
					/>
					<a href={ settingUrl }>{ __( 'Plugin Setting', 'responsive-spacer-block' ) }</a>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
