/**
 * WordPress dependencies
 */
import {
	insertBlock,
	createNewPost,
	getEditedPostContent,
	transformBlockTo,
	switchUserToAdmin,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import { changeHeight, inputValue, openSidebar, toggleNegativeSpace } from '../helper';

const page = global.page;

page.on( 'dialog', async ( dialog ) => await dialog.accept() );

describe( 'Block', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should create block', async () => {
		await insertBlock( 'Flexible Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should change all height', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'All', '200' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should change each height', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'Desktop', '200' );
		await changeHeight( 'Tablet', '300' );
		await changeHeight( 'Mobile', '400' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should apply negative space', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'Desktop', '200' );
		await changeHeight( 'Tablet', '300' );
		await changeHeight( 'Mobile', '400' );
		await toggleNegativeSpace( 'Desktop' );
		await toggleNegativeSpace( 'Tablet' );
		await toggleNegativeSpace( 'Mobile' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be converted to core table block by keeping desktop height', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'Desktop', '200' );
		await toggleNegativeSpace( 'Desktop' );
		await transformBlockTo( 'Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be converted to flexible spacer block by keeping height', async () => {
		await insertBlock( 'Spacer' );
		await openSidebar();
		const inputSelector = '.block-editor-block-inspector input[type="number"]';

		await inputValue( inputSelector, '200' );
		await transformBlockTo( 'Flexible Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be converted to flexible spacer block by converting height to px', async () => {
		await insertBlock( 'Spacer' );
		await openSidebar();
		const inputSelector = '.block-editor-block-inspector input[type="number"]';

		// WordPress 5.9 has no units for spacer block.
		try {
			const unitSelector = `select[aria-label="Select unit"]`;
			await page.select( unitSelector, 'em' );
		} catch {}

		await inputValue( inputSelector, '50' );
		await transformBlockTo( 'Flexible Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );

describe( 'Setting', () => {
	it( 'should be saved', async () => {
		await switchUserToAdmin();
		const smSelector = `input[name="flexible_spacer_block_breakpoint[sm]"]`;
		const mdSelector = `input[name="flexible_spacer_block_breakpoint[md]"]`;
		const showBlocksSelector = `input[name="flexible_spacer_block_show_block"]`;
		const submitButton = 'input[id="submit"]';

		await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );
		await inputValue( smSelector, 500 );
		await inputValue( mdSelector, 1000 );
		await page.click( showBlocksSelector );
		await page.click( submitButton );

		await page.waitForSelector( smSelector );
		await page.waitForSelector( mdSelector );
		const smValue = await page.$eval( smSelector, ( element ) => element.value );
		const mdValue = await page.$eval( mdSelector, ( element ) => element.value );
		const blockSelectorValue = await page.$eval( showBlocksSelector, ( element ) => element.value );

		expect( smValue ).toBe( '500' );
		expect( mdValue ).toBe( '1000' );
		expect( blockSelectorValue ).toBe( '1' );
	} );

	it( 'should be saved if the values are invalid', async () => {
		await switchUserToAdmin();
		const smSelector = `input[name="flexible_spacer_block_breakpoint[sm]"]`;
		const mdSelector = `input[name="flexible_spacer_block_breakpoint[md]"]`;
		const submitButton = 'input[id="submit"]';

		await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );

		await inputValue( smSelector, '' );
		await inputValue( mdSelector, '' );
		await page.click( submitButton );

		await expect( page ).toMatchElement( '#setting-error-flexible-spacer-block-breakpoint-null' );

		await inputValue( smSelector, 1000 );
		await inputValue( mdSelector, 500 );
		await page.click( submitButton );

		await expect( page ).toMatchElement(
			'#setting-error-flexible-spacer-block-breakpoint-compare'
		);
	} );
} );
