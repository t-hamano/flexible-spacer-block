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

	test( 'should change all height', async ( { editor, fsbUtils } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeight( 'all', '200' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should change all height unit', async ( { editor, fsbUtils } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeightUnit( 'all', 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should change each height', async ( { editor, fsbUtils } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeight( 'lg', '200' );
		await fsbUtils.changeHeight( 'md', '300' );
		await fsbUtils.changeHeight( 'sm', '400' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should change each height unit', async ( { editor, fsbUtils } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeightUnit( 'lg', '%' );
		await fsbUtils.changeHeightUnit( 'md', 'em' );
		await fsbUtils.changeHeightUnit( 'sm', 'rem' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should apply negative space', async ( { editor, fsbUtils } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeight( 'lg', '200' );
		await fsbUtils.changeHeight( 'md', '300' );
		await fsbUtils.changeHeight( 'sm', '400' );
		await fsbUtils.toggleNegativeSpace( 'lg' );
		await fsbUtils.toggleNegativeSpace( 'md' );
		await fsbUtils.toggleNegativeSpace( 'sm' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should apply edged value correctly if the value is falsy', async ( {
		editor,
		fsbUtils,
	} ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeight( 'lg', '0' );
		await fsbUtils.changeHeight( 'md', '' );
		await fsbUtils.changeHeight( 'sm', '0' );
		await fsbUtils.changeHeightUnit( 'sm', 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should apply edged value correctly if the value is falsy and negative', async ( {
		editor,
		fsbUtils,
	} ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeight( 'lg', '0' );
		await fsbUtils.changeHeight( 'md', '' );
		await fsbUtils.changeHeight( 'sm', '0' );
		await fsbUtils.toggleNegativeSpace( 'lg' );
		await fsbUtils.toggleNegativeSpace( 'md' );
		await fsbUtils.toggleNegativeSpace( 'sm' );
		await fsbUtils.changeHeightUnit( 'sm', 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to core spacer block', async ( { editor } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.transformBlockTo( 'core/spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to core spacer block by keeping desktop height', async ( {
		editor,
		fsbUtils,
	} ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await fsbUtils.changeHeight( 'lg', '200' );
		await fsbUtils.changeHeightUnit( 'lg', 'em' );
		await fsbUtils.toggleNegativeSpace( 'lg' );
		await editor.transformBlockTo( 'core/spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to flexible spacer block', async ( { editor } ) => {
		await editor.insertBlock( { name: 'core/spacer' } );
		await editor.transformBlockTo( 'fsb/flexible-spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to flexible spacer block by keeping height', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'core/spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.fill( '.block-editor-block-inspector input[type="number"]', '200' );
		await editor.transformBlockTo( 'fsb/flexible-spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );
} );

test.describe( 'Setting', () => {
	const smSelector = 'input[name="flexible_spacer_block_default_value[sm]"]';
	const mdSelector = 'input[name="flexible_spacer_block_default_value[md]"]';
	const smUnitSelector = 'select[name="flexible_spacer_block_default_value[sm_unit]"]';
	const mdUnitSelector = 'select[name="flexible_spacer_block_default_value[md_unit]"]';
	const submitButton = 'input[id="submit"]';

	test.describe( 'breakpoints', () => {
		test( 'should be saved', async ( { admin, page } ) => {
			await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
			await page.fill( smSelector, '500' );
			await page.fill( mdSelector, '1000' );
			await page.click( submitButton );
			await expect( page.locator( smSelector ) ).toHaveValue( '500' );
			await expect( page.locator( mdSelector ) ).toHaveValue( '1000' );
		} );

		test( 'should show error if the values are invalid', async ( { admin, page } ) => {
			await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
			await page.fill( smSelector, '' );
			await page.fill( mdSelector, '' );
			await page.click( submitButton );

			// Null values
			await expect(
				page.locator( '#setting-error-flexible-spacer-block-breakpoint-null' )
			).toBeVisible();

			await page.fill( smSelector, '1000' );
			await page.fill( mdSelector, '500' );
			await page.click( submitButton );

			// The screen width value in the left field is larger than the value in the right field
			await expect(
				page.locator( '#setting-error-flexible-spacer-block-breakpoint-compare' )
			).toBeVisible();
		} );
	} );

	test( 'default values should be saved', async ( { admin, page } ) => {
		await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
		await page.fill( smSelector, '300' );
		await page.fill( mdSelector, '500' );
		await page.selectOption( smUnitSelector, '%' );
		await page.selectOption( mdUnitSelector, 'em' );
		await page.click( submitButton );

		await expect( page.locator( smSelector ) ).toHaveValue( '300' );
		await expect( page.locator( mdSelector ) ).toHaveValue( '500' );
		await expect( page.locator( smUnitSelector ) ).toHaveValue( '%' );
		await expect( page.locator( mdUnitSelector ) ).toHaveValue( 'em' );

		// Finally update with default values.
		await page.fill( smSelector, '100' );
		await page.fill( mdSelector, '100' );
		await page.selectOption( smUnitSelector, 'px' );
		await page.selectOption( mdUnitSelector, 'px' );
		await page.click( submitButton );
	} );

	test( 'block editor should be toggled', async ( { admin, page } ) => {
		const selector = `input[name="flexible_spacer_block_show_block"]`;
		await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
		const currentCheckbox = await page.locator( selector );
		const currentChecked = await currentCheckbox.evaluate( ( element ) => element.checked );
		await currentCheckbox.click();
		await page.click( submitButton );
		const newCheckbox = await page.locator( selector );
		const newChecked = await newCheckbox.evaluate( ( element ) => element.checked );
		expect( newChecked ).toBe( ! currentChecked );
	} );
} );

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

	async toggleNegativeSpace( slug ) {
		await this.page.click( `.fsb-flexible-spacer__sidebar-${ slug } input[type="checkbox"]` );
	}
}
