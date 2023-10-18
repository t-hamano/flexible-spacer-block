/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.use( {
	fsbUtils: async ( { page }, use ) => {
		await use( new FsbUtils( { page } ) );
	},
} );

test.describe( 'Block', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test.skip( 'should be created', async ( { editor } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test.skip( 'should change all height', async ( { editor, fsbUtils } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeight( 'all', '200' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test.skip( 'should change all height unit', async ( { editor, fsbUtils } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeightUnit( 'all', 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	// test( 'should change each height', async ( { editor } ) => {
	// 	await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
	// 	await editor.openDocumentSettingsSidebar();
	// 	await changeHeight( 'lg', '200' );
	// 	await changeHeight( 'md', '300' );
	// 	await changeHeight( 'sm', '400' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should change each height unit', async ( { editor } ) => {
	// 	await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
	// 	await editor.openDocumentSettingsSidebar();
	// 	await changeHeightUntest( 'lg', '%' );
	// 	await changeHeightUntest( 'md', 'em' );
	// 	await changeHeightUntest( 'sm', 'rem' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should apply negative space', async ( { editor } ) => {
	// 	await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
	// 	await editor.openDocumentSettingsSidebar();
	// 	await changeHeight( 'lg', '200' );
	// 	await changeHeight( 'md', '300' );
	// 	await changeHeight( 'sm', '400' );
	// 	await toggleNegativeSpace( 'lg' );
	// 	await toggleNegativeSpace( 'md' );
	// 	await toggleNegativeSpace( 'sm' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should apply edged value correctly if the value is falsy', async ( { editor } ) => {
	// 	await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
	// 	await editor.openDocumentSettingsSidebar();
	// 	await changeHeight( 'lg', '0' );
	// 	await changeHeight( 'md', '' );
	// 	await changeHeight( 'sm', '0' );
	// 	await changeHeightUntest( 'sm', 'em' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should apply edged value correctly if the value is falsy and negative', async ( {
	// 	editor,
	// } ) => {
	// 	await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
	// 	await editor.openDocumentSettingsSidebar();
	// 	await changeHeight( 'lg', '0' );
	// 	await changeHeight( 'md', '' );
	// 	await changeHeight( 'sm', '0' );
	// 	await toggleNegativeSpace( 'lg' );
	// 	await toggleNegativeSpace( 'md' );
	// 	await toggleNegativeSpace( 'sm' );
	// 	await changeHeightUntest( 'sm', 'em' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should be converted to core spacer block', async ( { editor } ) => {
	// 	await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
	// 	await transformBlockTo( 'Spacer' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should be converted to core spacer block by keeping desktop height', async ( {
	// 	editor,
	// } ) => {
	// 	await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
	// 	await editor.openDocumentSettingsSidebar();
	// 	await changeHeight( 'lg', '200' );
	// 	await changeHeightUntest( 'lg', 'em' );
	// 	await toggleNegativeSpace( 'lg' );
	// 	await transformBlockTo( 'Spacer' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should be converted to flexible spacer block', async ( { editor } ) => {
	// 	await editor.insertBlock( { name: 'core/spacer' } );
	// 	await transformBlockTo( 'Flexible Spacer' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );

	// test( 'should be converted to flexible spacer block by keeping height', async ( { editor } ) => {
	// 	await editor.insertBlock( { name: 'core/spacer' } );
	// 	await editor.openDocumentSettingsSidebar();
	// 	await inputValue( '.block-editor-block-inspector input[type="number"]', '200' );
	// 	await transformBlockTo( 'Flexible Spacer' );

	// 	expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	// } );
} );

// test.describe( 'Setting', () => {
// 	test.describe( 'breakpoints', () => {
// 		test( 'should be saved', async () => {
// 			await switchUserToAdmin();
// 			const smSelector = 'input[name="flexible_spacer_block_breakpoint[sm]"]';
// 			const mdSelector = 'input[name="flexible_spacer_block_breakpoint[md]"]';
// 			const submitButton = 'input[id="submit"]';

// 			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );
// 			await inputValue( smSelector, 500 );
// 			await inputValue( mdSelector, 1000 );
// 			await page.click( submitButton );

// 			const smValue = await page.$eval( smSelector, ( element ) => element.value );
// 			const mdValue = await page.$eval( mdSelector, ( element ) => element.value );

// 			expect( smValue ).toBe( '500' );
// 			expect( mdValue ).toBe( '1000' );
// 		} );

// 		test( 'should show error if the values are invalid', async () => {
// 			await switchUserToAdmin();
// 			const smSelector = 'input[name="flexible_spacer_block_breakpoint[sm]"]';
// 			const mdSelector = 'input[name="flexible_spacer_block_breakpoint[md]"]';
// 			const submitButton = 'input[id="submit"]';

// 			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );

// 			await inputValue( smSelector, '' );
// 			await inputValue( mdSelector, '' );
// 			await page.click( submitButton );

// 			// Null values
// 			await expect( page ).toMatchElement( '#setting-error-flexible-spacer-block-breakpoint-null' );

// 			await inputValue( smSelector, 1000 );
// 			await inputValue( mdSelector, 500 );
// 			await page.click( submitButton );

// 			// The screen width value in the left field is larger than the value in the right field
// 			await expect( page ).toMatchElement(
// 				'#setting-error-flexible-spacer-block-breakpoint-compare'
// 			);
// 		} );
// 	} );

// 	describe( 'default values', () => {
// 		test( 'should be saved', async () => {
// 			await switchUserToAdmin();
// 			const smSelector = 'input[name="flexible_spacer_block_default_value[sm]"]';
// 			const mdSelector = 'input[name="flexible_spacer_block_default_value[md]"]';
// 			const smUnitSelector = 'select[name="flexible_spacer_block_default_value[sm_unit]"]';
// 			const mdUnitSelector = 'select[name="flexible_spacer_block_default_value[md_unit]"]';
// 			const submitButton = 'input[id="submit"]';

// 			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );
// 			await inputValue( smSelector, 300 );
// 			await inputValue( mdSelector, 500 );
// 			await page.select( smUnitSelector, '%' );
// 			await page.select( mdUnitSelector, 'em' );
// 			await page.click( submitButton );

// 			const smValue = await page.$eval( smSelector, ( element ) => element.value );
// 			const mdValue = await page.$eval( mdSelector, ( element ) => element.value );
// 			const smUnitValue = await page.$eval( smUnitSelector, ( element ) => element.value );
// 			const mdUnitValue = await page.$eval( mdUnitSelector, ( element ) => element.value );

// 			expect( smValue ).toBe( '300' );
// 			expect( mdValue ).toBe( '500' );
// 			expect( smUnitValue ).toBe( '%' );
// 			expect( mdUnitValue ).toBe( 'em' );

// 			// Finally update with default values.
// 			await inputValue( smSelector, 100 );
// 			await inputValue( mdSelector, 100 );
// 			await page.select( smUnitSelector, 'px' );
// 			await page.select( mdUnitSelector, 'px' );
// 			await page.click( submitButton );
// 		} );
// 	} );

// 	describe( 'block editor setting', () => {
// 		test( 'should be toggled', async () => {
// 			await switchUserToAdmin();
// 			const selector = `input[name="flexible_spacer_block_show_block"]`;
// 			const submitButton = 'input[id="submit"]';

// 			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );

// 			const currentCheckbox = await page.$( selector );
// 			const currentChecked = await ( await currentCheckbox.getProperty( 'checked' ) ).jsonValue();

// 			await page.click( selector );
// 			await page.click( submitButton );

// 			const newCheckbox = await page.$( selector );
// 			const newChecked = await ( await newCheckbox.getProperty( 'checked' ) ).jsonValue();

// 			expect( newChecked ).toBe( ! currentChecked );
// 		} );
// 	} );
// } );

class FsbUtils {
	constructor( { page, pageUtils } ) {
		this.page = page;
		this.pageUtils = pageUtils;
	}

	async changeHeight( slug, value ) {
		await this.page.fill( `.fsb-flexible-spacer__sidebar-${ slug } input[type="number"]`, value );
	}

	async changeHeightUnit( slug, value ) {
		await this.page.selectOption( `.fsb-flexible-spacer__sidebar-${ slug } select`, value );
	}
}
