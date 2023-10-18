/**
 * WordPress dependencies
 */
import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

const page = global.page;

export const inputValue = async ( selector, value ) => {
	await page.focus( selector );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Delete' );
	await page.keyboard.type( String( value ) );
};

export const changeHeight = async ( slug, value ) => {
	const selector = `.fsb-flexible-spacer__sidebar-${ slug } input[type="number"]`;
	await page.focus( selector );
	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Delete' );
	await page.keyboard.type( String( value ) );
};

export const changeHeightUnit = async ( slug, value ) => {
	const selector = `.fsb-flexible-spacer__sidebar-${ slug } select`;
	await page.select( selector, value );
};

export const toggleNegativeSpace = async ( slug ) => {
	const selector = `.fsb-flexible-spacer__sidebar-${ slug } input[type="checkbox"]`;
	await page.click( selector );
};
