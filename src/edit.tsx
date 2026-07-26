/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	getSpacingPresetCssVar,
	isValueSpacingPreset,
	__experimentalSpacingSizesControl as SpacingSizesControl,
} from '@wordpress/block-editor';
import {
	ResizableBox,
	ToggleControl,
	HorizontalRule,
	ToolbarGroup,
	ToolbarButton,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from '@wordpress/components';
import { Link, Stack } from '@wordpress/ui';
import { useEffect, useState } from '@wordpress/element';
import { View } from '@wordpress/primitives';
import { Icon, mobile, tablet, desktop } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';
import { useViewportMatch } from '@wordpress/compose';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { responsive } from './icons';
import { store } from './store';
import type { BlockAttributes } from './types';

import { MIN_SPACER_HEIGHT, DEFAULT_SPACER_HEIGHT, DEFAULT_SPACER_HEIGHT_UNIT } from './constants';

type HeightValue = string | number | undefined;

interface SpacerControl {
	label: string;
	slug: string;
	value: string | undefined;
	isResizing: boolean;
	syncKey?: number;
	onPresetChange: ( value: string | undefined ) => void;
	isNegative?: boolean;
	onNegativeChange?: ( value: boolean ) => void;
	hasValue: () => boolean;
	onDeselect: () => void;
}

// Renders the height input for a single device. When the theme provides no
// spacing presets the control degrades to a plain value input on its own.
function HeightControl( {
	label,
	value = '',
	isResizing,
	syncKey,
	onPresetChange,
}: {
	label: string;
	value?: string;
	isResizing: boolean;
	syncKey?: number;
	onPresetChange: ( value: string | undefined ) => void;
} ) {
	const [ parsedQuantity, parsedUnit ] = parseQuantityAndUnitFromRawValue( value );
	// Force the unit to `px` while resizing.
	const computedValue =
		( isValueSpacingPreset( value )
			? value
			: [ parsedQuantity, isResizing ? 'px' : parsedUnit ].join( '' ) ) || undefined;

	return (
		<SpacingSizesControl
			// Remount when "All heights" writes into this device.
			key={ syncKey }
			values={ { all: computedValue } }
			onChange={ ( { all }: { all?: string } ) => onPresetChange( all || undefined ) }
			label={ label }
			sides={ [ 'all' ] }
			showSideInLabel={ false }
		/>
	);
}

interface SpacerDevice {
	label: string;
	slug: string;
	icon: JSX.Element;
	isNegative: boolean;
	height: string;
	onResizeStart: () => void;
	onResize: () => void;
	onResizeStop: ( event: unknown, direction: unknown, elt: HTMLElement ) => void;
	isResizing: boolean;
}

export default function Edit( {
	attributes,
	isSelected,
	setAttributes,
	toggleSelection,
}: BlockEditProps< BlockAttributes > & {
	// Injected by the block editor at runtime; not part of `BlockEditProps`.
	toggleSelection?: ( isSelectionEnabled: boolean ) => void;
} ) {
	const { heightLg, heightMd, heightSm, isNegativeLg, isNegativeMd, isNegativeSm } = attributes;
	const [ heightAll, setHeightAll ] = useState< string | undefined >(
		heightLg === heightMd && heightMd === heightSm ? heightLg : undefined
	);
	const [ activeDevice, setActiveDevice ] = useState< string | undefined >( undefined );
	const [ isResizingLg, setIsResizingLg ] = useState( false );
	const [ isResizingMd, setIsResizingMd ] = useState( false );
	const [ isResizingSm, setIsResizingSm ] = useState( false );
	const [ temporaryWidthLg, setTemporaryWidthLg ] = useState< string | null >( null );
	const [ temporaryWidthMd, setTemporaryWidthMd ] = useState< string | null >( null );
	const [ temporaryWidthSm, setTemporaryWidthSm ] = useState< string | null >( null );
	// The device controls never switch back to the preset view on their own, so
	// remount them when "All heights" writes a height into them.
	const [ deviceSyncKey, setDeviceSyncKey ] = useState( 0 );

	const isResponsive = useSelect( ( select ) => select( store ).getIsResponsive(), [] );
	const { setIsResponsive } = useDispatch( store );
	const isMobile = useViewportMatch( 'medium', '<' );

	const isEnableMd = parseInt( fsbConf.breakpoint.md ) !== parseInt( fsbConf.breakpoint.sm );
	const isShowBlock = fsbConf.showBlock;
	const defaultValue = fsbConf.defaultValue;

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

	const defaultLgValue = defaultValue.lg + defaultValue.lg_unit;
	const defaultMdValue = defaultValue.md + defaultValue.md_unit;
	const defaultSmValue = defaultValue.sm + defaultValue.sm_unit;

	const settingUrl = addQueryArgs( 'options-general.php', {
		page: 'flexible-spacer-block-option',
	} );

	const blockProps = useBlockProps( {
		className: clsx( 'fsb-flexible-spacer', {
			'fsb-flexible-spacer--is-show-block': !! isShowBlock,
			'fsb-flexible-spacer--is-responsive': !! isResponsive,
		} ),
	} );

	function getUpdatedHeight(
		currentValue: HeightValue,
		newValue: HeightValue
	): string | undefined {
		if ( ! newValue ) {
			return undefined;
		}

		const [ newParsedQuantity, newParsedUnit ] = parseQuantityAndUnitFromRawValue( newValue );
		const [ , currentParsedUnit ] = parseQuantityAndUnitFromRawValue( currentValue );
		const newUnit = newParsedUnit || currentParsedUnit || 'px';
		return newParsedQuantity + newUnit;
	}

	const onChangeHeightLg = ( currentValue: HeightValue, newValue: HeightValue ) => {
		setAttributes( { heightLg: getUpdatedHeight( currentValue, newValue ) } );
		if ( ! isEnableMd ) {
			setAttributes( { heightMd: getUpdatedHeight( currentValue, newValue ) } );
		}
		setTemporaryWidthLg( null );
	};

	const onChangeHeightMd = ( currentValue: HeightValue, newValue: HeightValue ) => {
		setAttributes( { heightMd: getUpdatedHeight( currentValue, newValue ) } );
		setTemporaryWidthMd( null );
	};

	const onChangeHeightSm = ( currentValue: HeightValue, newValue: HeightValue ) => {
		setAttributes( { heightSm: getUpdatedHeight( currentValue, newValue ) } );
		setTemporaryWidthSm( null );
	};

	const resetAll = () => {
		setAttributes( {
			heightLg: defaultLgValue,
			heightMd: isEnableMd ? defaultMdValue : defaultLgValue,
			heightSm: defaultSmValue,
			isNegativeLg: false,
			isNegativeMd: false,
			isNegativeSm: false,
		} );
		setHeightAll( defaultLgValue );
	};

	const SPACER_CONTROLS: SpacerControl[] = [
		{
			label: __( 'All heights', 'flexible-spacer-block' ),
			slug: 'all',
			value: heightAll,
			isResizing: false,
			onPresetChange: ( value ) => {
				setAttributes( { heightLg: value, heightMd: value, heightSm: value } );
				setHeightAll( value );
				setDeviceSyncKey( ( key ) => key + 1 );
			},
			hasValue: () =>
				heightLg !== defaultLgValue ||
				heightMd !== defaultMdValue ||
				heightSm !== defaultSmValue ||
				isNegativeLg ||
				isNegativeMd ||
				isNegativeSm,
			onDeselect: resetAll,
		},
		{
			label: __( 'Desktop height', 'flexible-spacer-block' ),
			slug: 'lg',
			value: temporaryWidthLg || heightLg,
			isResizing: isResizingLg,
			syncKey: deviceSyncKey,
			onPresetChange: ( value ) => {
				setAttributes( { heightLg: value } );
				if ( ! isEnableMd ) {
					setAttributes( { heightMd: value } );
				}
				setTemporaryWidthLg( null );
			},
			isNegative: isNegativeLg,
			onNegativeChange: ( value ) => {
				setAttributes( { isNegativeLg: value } );
				if ( ! isEnableMd ) {
					setAttributes( { isNegativeMd: value } );
				}
			},
			hasValue: () => heightLg !== defaultLgValue || isNegativeLg,
			onDeselect: () => setAttributes( { heightLg: defaultLgValue, isNegativeLg: false } ),
		},
		{
			label: __( 'Tablet height', 'flexible-spacer-block' ),
			slug: 'md',
			value: temporaryWidthMd || heightMd,
			isResizing: isResizingMd,
			syncKey: deviceSyncKey,
			onPresetChange: ( value ) => {
				setAttributes( { heightMd: value } );
				setTemporaryWidthMd( null );
			},
			isNegative: isNegativeMd,
			onNegativeChange: ( value ) => setAttributes( { isNegativeMd: value } ),
			hasValue: () => heightMd !== defaultMdValue || isNegativeMd,
			onDeselect: () => setAttributes( { heightMd: defaultMdValue, isNegativeMd: false } ),
		},
		{
			label: __( 'Mobile height', 'flexible-spacer-block' ),
			slug: 'sm',
			value: temporaryWidthSm || heightSm,
			isResizing: isResizingSm,
			syncKey: deviceSyncKey,
			onPresetChange: ( value ) => {
				setAttributes( { heightSm: value } );
				setTemporaryWidthSm( null );
			},
			isNegative: isNegativeSm,
			onNegativeChange: ( value ) => setAttributes( { isNegativeSm: value } ),
			hasValue: () => heightSm !== defaultSmValue || isNegativeSm,
			onDeselect: () => setAttributes( { heightSm: defaultSmValue, isNegativeSm: false } ),
		},
	];

	const SPACER_DEVICES: SpacerDevice[] = [
		{
			label: __( 'Mobile', 'flexible-spacer-block' ),
			slug: 'sm',
			icon: mobile,
			isNegative: isNegativeSm,
			height: heightSm || defaultValue.sm,
			isResizing: isResizingSm,
			setIsResizing: setIsResizingSm,
			onChangeHeight: onChangeHeightSm,
			enabled: true,
		},
		{
			label: __( 'Tablet', 'flexible-spacer-block' ),
			slug: 'md',
			icon: tablet,
			isNegative: isNegativeMd,
			height: heightMd || defaultValue.md,
			isResizing: isResizingMd,
			setIsResizing: setIsResizingMd,
			onChangeHeight: onChangeHeightMd,
			enabled: isEnableMd,
		},
		{
			label: __( 'Desktop', 'flexible-spacer-block' ),
			slug: 'lg',
			icon: desktop,
			isNegative: isNegativeLg,
			height: heightLg || defaultValue.lg,
			isResizing: isResizingLg,
			setIsResizing: setIsResizingLg,
			onChangeHeight: onChangeHeightLg,
			enabled: true,
		},
	]
		.filter( ( device ) => device.enabled )
		.map( ( { enabled, setIsResizing, onChangeHeight, ...device } ) => ( {
			...device,
			onResizeStart: () => toggleSelection?.( false ),
			onResize: () => setIsResizing( true ),
			onResizeStop: ( _event: unknown, _direction: unknown, elt: HTMLElement ) => {
				onChangeHeight( undefined, `${ elt.clientHeight }px` );
				setIsResizing( false );
			},
		} ) );

	const dropdownMenuProps = ! isMobile
		? {
				popoverProps: {
					placement: 'left-start' as const,
					offset: 259,
				},
		  }
		: {};

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
				<ToolsPanel
					label={ __( 'Settings', 'flexible-spacer-block' ) }
					dropdownMenuProps={ dropdownMenuProps }
					className="fsb-flexible-spacer__sidebar"
					resetAll={ resetAll }
				>
					{ SPACER_CONTROLS.map( ( control ) => (
						<ToolsPanelItem
							key={ control.slug }
							label={ control.label }
							isShownByDefault
							hasValue={ control.hasValue }
							onDeselect={ control.onDeselect }
						>
							<Stack direction="column" gap="lg">
								<Stack
									direction="column"
									gap="md"
									onMouseEnter={ () => setActiveDevice( control.slug ) }
									onMouseLeave={ () => setActiveDevice( undefined ) }
								>
									<HeightControl
										label={ control.label }
										value={ control.value }
										isResizing={ control.isResizing }
										syncKey={ control.syncKey }
										onPresetChange={ control.onPresetChange }
									/>
									{ control.onNegativeChange && (
										<ToggleControl
											label={ __( 'Negative space', 'flexible-spacer-block' ) }
											checked={ control.isNegative }
											onChange={ control.onNegativeChange }
										/>
									) }
								</Stack>
								<HorizontalRule />
							</Stack>
						</ToolsPanelItem>
					) ) }
					<Link href={ settingUrl } openInNewTab>
						{ __( 'Plugin Setting', 'flexible-spacer-block' ) }
					</Link>
				</ToolsPanel>
			</InspectorControls>
			<View { ...blockProps }>
				<div className="fsb-flexible-spacer__inner">
					<div className="fsb-flexible-spacer__breakpoint">
						<div className="fsb-flexible-spacer__breakpoint-item">
							{ sprintf(
								/* translators: %d: Breakpoint width in pixels. */
								__( '≤ %dpx <', 'flexible-spacer-block' ),
								Number( fsbConf.breakpoint.sm )
							) }
						</div>
						{ isEnableMd && (
							<div className="fsb-flexible-spacer__breakpoint-item">
								{ sprintf(
									/* translators: %d: Breakpoint width in pixels. */
									__( '≤ %dpx <', 'flexible-spacer-block' ),
									Number( fsbConf.breakpoint.md )
								) }
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
							<div style={ { height: getSpacingPresetCssVar( device.height ) } }>
								<ResizableBox
									className={ clsx( 'fsb-flexible-spacer__device-resizer', {
										'is-resizing': device.isResizing,
										'is-negative': !! device.isNegative,
										'is-active': activeDevice === device.slug,
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
								>
									{ /* `children` is required by the type, but is not actually needed here, so render a dummy element. */ }
									{ /* TODO: Remove this once https://github.com/WordPress/gutenberg/pull/79370 is merged. */ }
									<></>
								</ResizableBox>
							</div>
						</div>
					) ) }
				</div>
			</View>
		</>
	);
}
