/**
 * External dependencies
 */
import clsx from 'clsx';

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
	__experimentalUnitControl as UnitControl,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { View } from '@wordpress/primitives';
import { Icon, settings, mobile, tablet, desktop } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { responsive } from './icons';

import {
	MIN_SPACER_HEIGHT,
	MAX_SPACER_HEIGHT,
	DEFAULT_SPACER_HEIGHT,
	DEFAULT_SPACER_HEIGHT_UNIT,
} from './constants';

export default function Edit( { attributes, isSelected, setAttributes, toggleSelection } ) {
	const [ heightAll, setHeightAll ] = useState( DEFAULT_SPACER_HEIGHT.DEFAULT_SPACER_HEIGHT_UNIT );
	const [ isResizingLg, setIsResizingLg ] = useState( false );
	const [ isResizingMd, setIsResizingMd ] = useState( false );
	const [ isResizingSm, setIsResizingSm ] = useState( false );
	const [ temporaryWidthLg, setTemporaryWidthLg ] = useState( null );
	const [ temporaryWidthMd, setTemporaryWidthMd ] = useState( null );
	const [ temporaryWidthSm, setTemporaryWidthSm ] = useState( null );

	const isResponsive = useSelect( ( select ) =>
		select( 'flexible-spacer-block' ).getIsResponsive()
	);
	const { setIsResponsive } = useDispatch( 'flexible-spacer-block' );

	const isEnableMd = parseInt( fsbConf.breakpoint.md ) !== parseInt( fsbConf.breakpoint.sm );
	const isShowBlock = fsbConf.showBlock;
	const defaultValue = fsbConf.defaultValue;

	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;

	// Apply default values from the settings page when inserting a block.
	useEffect( () => {
		if (
			heightLg === `${ DEFAULT_SPACER_HEIGHT }${ DEFAULT_SPACER_HEIGHT_UNIT }` &&
			heightMd === `${ DEFAULT_SPACER_HEIGHT }${ DEFAULT_SPACER_HEIGHT_UNIT }` &&
			heightSm === `${ DEFAULT_SPACER_HEIGHT }${ DEFAULT_SPACER_HEIGHT_UNIT }`
		) {
			setAttributes( {
				heightLg: defaultValue.lg + defaultValue.lg_unit,
				heightMd: defaultValue.md + defaultValue.md_unit,
				heightSm: defaultValue.sm + defaultValue.sm_unit,
			} );
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		className: clsx( 'fsb-flexible-spacer', {
			'fsb-flexible-spacer--is-show-block': !! isShowBlock,
			'fsb-flexible-spacer--is-responsive': !! isResponsive,
		} ),
	} );

	function getUpdatedHeight( currentValue, newValue ) {
		if ( ! newValue ) {
			return undefined;
		}

		const [ newParsedQuantity, newParsedUnit ] = parseQuantityAndUnitFromRawValue( newValue );
		const [ , currentParsedUnit ] = parseQuantityAndUnitFromRawValue( currentValue );
		const newUnit = newParsedUnit || currentParsedUnit || 'px';
		return newParsedQuantity + newUnit;
	}

	const onChangeHeightAll = ( currentValue, newValue ) => {
		const updatedHeight = getUpdatedHeight( currentValue, newValue );
		setAttributes( {
			heightLg: updatedHeight,
			heightMd: updatedHeight,
			heightSm: updatedHeight,
		} );
		setHeightAll( updatedHeight );
	};

	const onChangeHeightLg = ( currentValue, newValue ) => {
		setAttributes( { heightLg: getUpdatedHeight( currentValue, newValue ) } );
		if ( ! isEnableMd ) {
			setAttributes( { heightMd: getUpdatedHeight( currentValue, newValue ) } );
		}
		setTemporaryWidthLg( null );
	};

	const onChangeHeightMd = ( currentValue, newValue ) => {
		setAttributes( { heightMd: getUpdatedHeight( currentValue, newValue ) } );
		setTemporaryWidthMd( null );
	};

	const onChangeHeightSm = ( currentValue, newValue ) => {
		setAttributes( { heightSm: getUpdatedHeight( currentValue, newValue ) } );
		setTemporaryWidthSm( null );
	};

	const SPACER_CONTROLS = [
		{
			label: __( 'Height (All)', 'flexible-spacer-block' ),
			icon: settings,
			slug: 'all',
			value: heightAll,
			quantity: parseQuantityAndUnitFromRawValue( heightAll )[ 0 ],
			onChange: ( value ) => onChangeHeightAll( heightAll, value ),
		},
		{
			label: __( 'Height (Desktop)', 'flexible-spacer-block' ),
			icon: desktop,
			slug: 'lg',
			value: heightLg,
			quantity: parseQuantityAndUnitFromRawValue( temporaryWidthLg || heightLg )[ 0 ],
			onChange: ( value ) => onChangeHeightLg( heightLg, value ),
			isNegative: isNegativeLg,
			onNegativeChange: ( value ) => {
				setAttributes( { isNegativeLg: value } );
				if ( ! isEnableMd ) {
					setAttributes( { isNegativeMd: value } );
				}
			},
		},
		{
			label: __( 'Height (Tablet)', 'flexible-spacer-block' ),
			icon: tablet,
			slug: 'md',
			value: heightMd,
			quantity: parseQuantityAndUnitFromRawValue( temporaryWidthMd || heightMd )[ 0 ],
			onChange: ( value ) => onChangeHeightMd( heightMd, value ),
			isNegative: isNegativeMd,
			onNegativeChange: ( value ) => setAttributes( { isNegativeMd: value } ),
		},
		{
			label: __( 'Height (Mobile)', 'flexible-spacer-block' ),
			icon: mobile,
			slug: 'sm',
			value: heightSm,
			quantity: parseQuantityAndUnitFromRawValue( heightSm )[ 0 ],
			onChange: ( value ) => onChangeHeightSm( temporaryWidthSm || heightSm, value ),
			isNegative: isNegativeSm,
			onNegativeChange: ( value ) => setAttributes( { isNegativeSm: value } ),
		},
	];

	const SPACER_DEVICES = [
		{
			label: __( 'Mobile', 'flexible-spacer-block' ),
			slug: 'sm',
			icon: mobile,
			isNegative: isNegativeSm,
			height: heightSm || defaultValue.sm,
			onResizeStart: () => toggleSelection( false ),
			onResize: () => setIsResizingSm( true ),
			onResizeStop: ( event, direction, elt ) => {
				onChangeHeightSm( undefined, `${ elt.clientHeight }px` );
				setIsResizingSm( false );
			},
			isResizing: isResizingSm,
		},
		isEnableMd && {
			label: __( 'Tablet', 'flexible-spacer-block' ),
			slug: 'md',
			icon: tablet,
			isNegative: isNegativeMd,
			height: heightMd || defaultValue.md,
			onResizeStart: () => toggleSelection( false ),
			onResize: () => setIsResizingMd( true ),
			onResizeStop: ( event, direction, elt ) => {
				onChangeHeightMd( undefined, `${ elt.clientHeight }px` );
				setIsResizingMd( false );
			},
			isResizing: isResizingMd,
		},
		{
			label: __( 'Desktop', 'flexible-spacer-block' ),
			slug: 'lg',
			icon: desktop,
			isNegative: isNegativeLg,
			height: heightLg || defaultValue.lg,
			onResizeStart: () => toggleSelection( false ),
			onResize: () => setIsResizingLg( true ),
			onResizeStop: ( event, direction, elt ) => {
				onChangeHeightLg( undefined, `${ elt.clientHeight }px` );
				setIsResizingLg( false );
			},
			isResizing: isResizingLg,
		},
	].filter( Boolean );

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
					{ SPACER_CONTROLS.map( ( control, index ) => (
						<div key={ index } className={ `fsb-flexible-spacer__sidebar-${ control.slug }` }>
							<RangeControl
								label={ control.label }
								beforeIcon={ <Icon icon={ control.icon } /> }
								min={ MIN_SPACER_HEIGHT }
								max={ MAX_SPACER_HEIGHT }
								value={ control.quantity }
								withInputField={ false }
								onChange={ control.onChange }
								__nextHasNoMarginBottom
								__next40pxDefaultSize
							/>
							<UnitControl
								value={ control.value }
								min={ MIN_SPACER_HEIGHT }
								onChange={ control.onChange }
								size="__unstable-large"
							/>
							{ control.onNegativeChange && (
								<ToggleControl
									label={ __( 'Negative space', 'flexible-spacer-block' ) }
									checked={ control.isNegative }
									onChange={ control.onNegativeChange }
									__nextHasNoMarginBottom
								/>
							) }
							<HorizontalRule />
						</div>
					) ) }
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
					{ SPACER_DEVICES.map( ( device, index ) => (
						<div
							key={ index }
							className={ `fsb-flexible-spacer__device fsb-flexible-spacer__device--${ device.slug }` }
						>
							<div className="fsb-flexible-spacer__device-ttl">
								<Icon icon={ device.icon } />
								{ device.label }
							</div>
							<div style={ { height: device.height } }>
								<ResizableBox
									className={ clsx( {
										'is-selected': isSelected,
										'is-resizing': device.isResizing,
										'is-negative': !! device.isNegative,
									} ) }
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
									onResizeStart={ device.onResizeStart }
									onResize={ device.onResize }
									onResizeStop={ device.onResizeStop }
									showHandle={ isSelected }
									__experimentalShowTooltip
									__experimentalTooltipProps={ {
										axis: 'y',
										position: 'bottom',
										isVisible: device.isResizing,
									} }
								/>
							</div>
						</div>
					) ) }
				</div>
			</View>
		</>
	);
}
