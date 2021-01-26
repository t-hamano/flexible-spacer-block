/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ResizableBox,
	RangeControl,
	Dashicon,
	ToggleControl,
	HorizontalRule
} from '@wordpress/components';
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

	const isEnableMd = parseInt( fsbConf.breakpoint.md ) !== parseInt( fsbConf.breakpoint.sm );
	const isShowBlock  = fsbConf.showBlock;

	const {
		heightLg,
		heightMd,
		heightSm,
		isNegativeLg,
		isNegativeMd,
		isNegativeSm
	} = attributes;

	const settingUrl = getWPAdminURL( 'options-general.php', {
		page: 'flexible-spacer-block-option'
	});

	const blockProps = useBlockProps({
		className: classnames( 'fsb-flexible-spacer', {
			[ 'fsb-flexible-spacer--is-show-block' ]: !! isShowBlock
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

	const updateIsNegativeLg = ( value ) => {
		setAttributes({ isNegativeLg: value });
		if ( ! isEnableMd ) {
			setAttributes({ isNegativeMd: value });
		}
	};
	const updateIsNegativeMd = ( value ) => setAttributes({ isNegativeMd: value });
	const updateIsNegativeSm = ( value ) => setAttributes({ isNegativeSm: value });

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
				<div className="fsb-flexible-spacer__inner">
					<div className="fsb-flexible-spacer__breakpoint">
						<div className=" fsb-flexible-spacer__breakpoint-item">&le; { fsbConf.breakpoint.sm }px &lt;</div>
						{ isEnableMd && (
							<div className=" fsb-flexible-spacer__breakpoint-item">&le; { fsbConf.breakpoint.md }px &lt;</div>
						) }
					</div>
					<div className="fsb-flexible-spacer__device">
						<div className="fsb-flexible-spacer__device-ttl">
							<Dashicon icon="smartphone" />{ __( 'Mobile', 'flexible-spacer-block' ) }
						</div>
						<ResizableBox
							className={ classnames(
								'block-library-spacer__resize-container',
								{
									'is-selected': isSelected,
									'is-negative': !! isNegativeSm
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
						<div className="fsb-flexible-spacer__device">
							<div className="fsb-flexible-spacer__device-ttl">
								<Dashicon icon="tablet" />{ __( 'Tablet', 'flexible-spacer-block' ) }
							</div>
							<ResizableBox
								className={ classnames(
									'block-library-spacer__resize-container',
									{
										'is-selected': isSelected,
										'is-negative': !! isNegativeMd
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
					<div className="fsb-flexible-spacer__device">
						<div className="fsb-flexible-spacer__device-ttl">
							<Dashicon icon="desktop" />{ __( 'Desktop', 'flexible-spacer-block' ) }
						</div>
						<ResizableBox
							className={ classnames(
								'block-library-spacer__resize-container',
								{
									'is-selected': isSelected,
									'is-negative': !! isNegativeLg
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
				<PanelBody title={ __( 'Spacer settings', 'flexible-spacer-block' ) }>
					<RangeControl
						label={ __( 'Height in pixels (All)', 'flexible-spacer-block' ) }
						beforeIcon="editor-ul"
						min={ MIN_SPACER_HEIGHT }
						max={ Math.max( MAX_SPACER_HEIGHT, heightAll ) }
						value={ heightAll }
						onChange={ updateHeightAll }
					/>
					<HorizontalRule />
					<RangeControl
						label={ __( 'Height in pixels (Desktop)', 'flexible-spacer-block' ) }
						beforeIcon="desktop"
						min={ MIN_SPACER_HEIGHT }
						max={ Math.max( MAX_SPACER_HEIGHT, heightLg ) }
						value={ heightLg }
						onChange={ updateHeightLg }
					/>
					<ToggleControl
						label={ __( 'Negative space', 'flexible-spacer-block' ) }
						checked={ isNegativeLg }
						onChange={ updateIsNegativeLg }
					/>
					<HorizontalRule />
					{ isEnableMd && (
						<>
							<RangeControl
								label={ __( 'Height in pixels (Tablet)', 'flexible-spacer-block' ) }
								beforeIcon="tablet"
								min={ MIN_SPACER_HEIGHT }
								max={ Math.max( MAX_SPACER_HEIGHT, heightMd ) }
								value={ heightMd }
								onChange={ updateHeightMd }
							/>
							<ToggleControl
								label={ __( 'Negative space', 'flexible-spacer-block' ) }
								checked={ isNegativeMd }
								onChange={ updateIsNegativeMd }
							/>
							<HorizontalRule />
						</>
						) }
					<RangeControl
						label={ __( 'Height in pixels (Mobile)', 'flexible-spacer-block' ) }
						beforeIcon="smartphone"
						min={ MIN_SPACER_HEIGHT }
						max={ Math.max( MAX_SPACER_HEIGHT, heightSm ) }
						value={ heightSm }
						onChange={ updateHeightSm }
					/>
					<ToggleControl
						label={ __( 'Negative space', 'flexible-spacer-block' ) }
						checked={ isNegativeSm }
						onChange={ updateIsNegativeSm }
					/>
					<a href={ settingUrl }>{ __( 'Plugin Setting', 'flexible-spacer-block' ) }</a>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
