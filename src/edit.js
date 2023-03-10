/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { InspectorControls, BlockControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ResizableBox,
	RangeControl,
	ToggleControl,
	HorizontalRule,
	ExternalLink,
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { View } from '@wordpress/primitives';
import { Icon, settings, mobile, tablet, desktop } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { responsive } from './icons';

const MIN_SPACER_HEIGHT = 0;
const MAX_SPACER_HEIGHT = 500;
const DEFAULT_SPACER_HEIGHT = 100;

export default function Edit( { attributes, isSelected, setAttributes, toggleSelection } ) {
	const [ heightAll, setHeightAll ] = useState( DEFAULT_SPACER_HEIGHT );
	const [ isResizingLg, setIsResizingLg ] = useState( false );
	const [ isResizingMd, setIsResizingMd ] = useState( false );
	const [ isResizingSm, setIsResizingSm ] = useState( false );

	const isResponsive = useSelect( ( select ) =>
		select( 'flexible-spacer-block' ).getIsResponsive()
	);
	const { setIsResponsive } = useDispatch( 'flexible-spacer-block' );

	const isEnableMd = parseInt( fsbConf.breakpoint.md ) !== parseInt( fsbConf.breakpoint.sm );
	const isShowBlock = fsbConf.showBlock;
	const defaultValue = fsbConf.defaultValue;

	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

	useEffect( () => {
		if (
			heightLg === DEFAULT_SPACER_HEIGHT &&
			heightMd === DEFAULT_SPACER_HEIGHT &&
			heightSm === DEFAULT_SPACER_HEIGHT
		) {
			setAttributes( {
				heightLg: defaultValue?.lg ?? DEFAULT_SPACER_HEIGHT,
				heightMd: defaultValue?.md ?? DEFAULT_SPACER_HEIGHT,
				heightSm: defaultValue?.sm ?? DEFAULT_SPACER_HEIGHT,
			} );
		}
	}, [] );

	useEffect( () => {
		if ( heightLg === heightMd && heightMd === heightSm ) {
			setHeightAll( heightLg );
		}
	}, [ heightLg, heightMd, heightSm ] );

	const settingUrl = addQueryArgs( 'options-general.php', {
		page: 'flexible-spacer-block-option',
	} );

	const blockProps = useBlockProps( {
		className: classnames( 'fsb-flexible-spacer', {
			'fsb-flexible-spacer--is-show-block': !! isShowBlock,
			'fsb-flexible-spacer--is-responsive': !! isResponsive,
		} ),
	} );

	const updateHeightAll = ( value ) => {
		setAttributes( {
			heightLg: value,
			heightMd: value,
			heightSm: value,
		} );
		setHeightAll( value );
	};

	const updateHeightLg = ( value ) => {
		setAttributes( { heightLg: value } );
		if ( ! isEnableMd ) {
			setAttributes( { heightMd: value } );
		}
	};
	const updateHeightMd = ( value ) => setAttributes( { heightMd: value } );
	const updateHeightSm = ( value ) => setAttributes( { heightSm: value } );

	const updateIsNegativeLg = ( value ) => {
		setAttributes( { isNegativeLg: value } );
		if ( ! isEnableMd ) {
			setAttributes( { isNegativeMd: value } );
		}
	};
	const updateIsNegativeMd = ( value ) => setAttributes( { isNegativeMd: value } );
	const updateIsNegativeSm = ( value ) => setAttributes( { isNegativeSm: value } );

	const handleOnResizeStartLg = () => {
		setIsResizingLg( true );
		toggleSelection( false );
	};

	const handleOnResizeStartMd = () => {
		setIsResizingMd( true );
		toggleSelection( false );
	};

	const handleOnResizeStartSm = () => {
		setIsResizingSm( true );
		toggleSelection( false );
	};

	const handleOnResizeStopLg = ( event, direction, elt, delta ) => {
		const spacerHeightLg = Math.min( parseInt( heightLg + delta.height, 10 ), MAX_SPACER_HEIGHT );
		updateHeightLg( spacerHeightLg );
		setIsResizingLg( false );
	};

	const handleOnResizeStopMd = ( event, direction, elt, delta ) => {
		const spacerHeightMd = Math.min( parseInt( heightMd + delta.height, 10 ), MAX_SPACER_HEIGHT );
		updateHeightMd( spacerHeightMd );
		setIsResizingMd( false );
	};

	const handleOnResizeStopSm = ( event, direction, elt, delta ) => {
		const spacerHeightSm = Math.min( parseInt( heightSm + delta.height, 10 ), MAX_SPACER_HEIGHT );
		updateHeightSm( spacerHeightSm );
		setIsResizingSm( false );
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ responsive }
						isPressed={ isResponsive }
						label={
							isResponsive
								? __( 'Disable responsive view', 'flexible-spacer-block' )
								: __( 'Enable responsive view', 'flexible-spacer-block' )
						}
						onClick={ () => setIsResponsive( ! isResponsive ) }
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Spacer settings', 'flexible-spacer-block' ) }
					className="fsb-flexible-spacer__sidebar"
				>
					<RangeControl
						label={ __( 'Height in pixels (All)', 'flexible-spacer-block' ) }
						beforeIcon={ <Icon icon={ settings } /> }
						min={ MIN_SPACER_HEIGHT }
						max={ Math.max( MAX_SPACER_HEIGHT, heightAll ) }
						value={ heightAll }
						onChange={ updateHeightAll }
					/>
					<HorizontalRule />
					<div id="flexible_spacer_block_height_desktop">
						<RangeControl
							label={ __( 'Height in pixels (Desktop)', 'flexible-spacer-block' ) }
							beforeIcon={ <Icon icon={ desktop } /> }
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
					</div>
					<HorizontalRule />
					{ isEnableMd && (
						<div id="flexible_spacer_block_height_tablet">
							<RangeControl
								label={ __( 'Height in pixels (Tablet)', 'flexible-spacer-block' ) }
								beforeIcon={ <Icon icon={ tablet } /> }
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
						</div>
					) }
					<div id="flexible_spacer_block_height_mobile">
						<RangeControl
							label={ __( 'Height in pixels (Mobile)', 'flexible-spacer-block' ) }
							beforeIcon={ <Icon icon={ mobile } /> }
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
					</div>
					<HorizontalRule />
					<ExternalLink href={ settingUrl }>
						{ __( 'Plugin Setting', 'flexible-spacer-block' ) }
					</ExternalLink>
				</PanelBody>
			</InspectorControls>
			<View { ...blockProps }>
				<div className="fsb-flexible-spacer__inner">
					<div className="fsb-flexible-spacer__breakpoint">
						<div className="fsb-flexible-spacer__breakpoint-item">
							&le; { fsbConf.breakpoint.sm }px &lt;
						</div>
						{ isEnableMd && (
							<div className="fsb-flexible-spacer__breakpoint-item">
								&le; { fsbConf.breakpoint.md }px &lt;
							</div>
						) }
					</div>
					<div className="fsb-flexible-spacer__device fsb-flexible-spacer__device--sm">
						<div className="fsb-flexible-spacer__device-ttl">
							<Icon icon={ mobile } />
							{ __( 'Mobile', 'flexible-spacer-block' ) }
						</div>
						<ResizableBox
							className={ classnames( {
								'is-selected': isSelected,
								'is-negative': !! isNegativeSm,
							} ) }
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
								topLeft: false,
							} }
							onResizeStart={ handleOnResizeStartSm }
							onResizeStop={ handleOnResizeStopSm }
							showHandle={ isSelected }
							__experimentalShowTooltip={ true }
							__experimentalTooltipProps={ {
								axis: 'y',
								position: 'bottom',
								isVisible: isResizingSm,
							} }
						/>
					</div>
					{ isEnableMd && (
						<div className="fsb-flexible-spacer__device fsb-flexible-spacer__device--md">
							<div className="fsb-flexible-spacer__device-ttl">
								<Icon icon={ tablet } />
								{ __( 'Tablet', 'flexible-spacer-block' ) }
							</div>
							<ResizableBox
								className={ classnames( {
									'is-selected': isSelected,
									'is-negative': !! isNegativeMd,
								} ) }
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
									topLeft: false,
								} }
								onResizeStart={ handleOnResizeStartMd }
								onResizeStop={ handleOnResizeStopMd }
								showHandle={ isSelected }
								__experimentalShowTooltip={ true }
								__experimentalTooltipProps={ {
									axis: 'y',
									position: 'bottom',
									isVisible: isResizingMd,
								} }
							/>
						</div>
					) }
					<div className="fsb-flexible-spacer__device fsb-flexible-spacer__device--lg">
						<div className="fsb-flexible-spacer__device-ttl">
							<Icon icon={ desktop } />
							{ __( 'Desktop', 'flexible-spacer-block' ) }
						</div>
						<ResizableBox
							className={ classnames( {
								'is-selected': isSelected,
								'is-negative': !! isNegativeLg,
							} ) }
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
								topLeft: false,
							} }
							onResizeStart={ handleOnResizeStartLg }
							onResizeStop={ handleOnResizeStopLg }
							showHandle={ isSelected }
							__experimentalShowTooltip={ true }
							__experimentalTooltipProps={ {
								axis: 'y',
								position: 'bottom',
								isVisible: isResizingLg,
							} }
						/>
					</div>
				</div>
			</View>
		</>
	);
}
