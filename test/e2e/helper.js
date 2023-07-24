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

export const inputValue = async ( selector, value ) => {
	await page.focus( selector );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Delete' );
	await page.keyboard.type( String( value ) );
};

export const changeHeight = async ( label, value ) => {
	const selector = `input[type="number"][aria-label="Height in pixels (${ label })"]`;
	await page.focus( selector );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Delete' );
	await page.keyboard.type( String( value ) );
};

export const toggleNegativeSpace = async ( slug ) => {
	const selector = `.fsb-flexible-spacer__sidebar-${ slug } input[type="checkbox"]`;
	await page.click( selector );
};
