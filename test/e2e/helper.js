/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const page = global.page;

export const openSidebar = async () => {
	const selector = '.edit-post-header [aria-label="Settings"]';
	const [ sidebarButton ] = await page.$$( `${ selector }[aria-expanded="false"]` );
	await sidebarButton.click();
};

export const inputValueFromLabel = async ( label, value ) => {
	const xPath = `//label[contains(@class, "control__label")][string()="${ label }"]`;
	const [ inputLabel ] = await page.$x( xPath );
	const inputId = await page.evaluate( ( element ) => element.getAttribute( 'for' ), inputLabel );
	await page.focus( `#${ inputId }` );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Delete' );
	await page.keyboard.type( String( value ) );
};

export const inputValue = async ( selector, value ) => {
	await page.focus( selector );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Delete' );
	await page.keyboard.type( String( value ) );
};

export const selectOptionFromAriaLabel = async ( ariaLabel, value ) => {
	const selector = `select[aria-label="${ ariaLabel }"]`;
	await page.select( selector, value );
};

export const changeHeight = async ( label, value ) => {
	const selector = `input[type="number"][aria-label="Height in pixels (${ label })"]`;
	await page.focus( selector );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Delete' );
	await page.keyboard.type( String( value ) );
};

export const toggleNegativeSpace = async ( label ) => {
	const selector = `#flexible_spacer_block_height_${ label.toLowerCase() } input[type="checkbox"]`;
	await page.click( selector );
};
