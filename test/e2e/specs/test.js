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
import {
	changeHeight,
	changeHeightUnit,
	inputValue,
	openSidebar,
	toggleNegativeSpace,
} from '../helper';

const page = global.page;

page.on( 'dialog', async ( dialog ) => await dialog.accept() );

describe( 'Block', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should be created', async () => {
		await insertBlock( 'Flexible Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should change all height', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'all', '200' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should change all height unit', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeightUnit( 'all', 'em' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should change each height', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'lg', '200' );
		await changeHeight( 'md', '300' );
		await changeHeight( 'sm', '400' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should change each height unit', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeightUnit( 'lg', '%' );
		await changeHeightUnit( 'md', 'em' );
		await changeHeightUnit( 'sm', 'rem' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should apply negative space', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'lg', '200' );
		await changeHeight( 'md', '300' );
		await changeHeight( 'sm', '400' );
		await toggleNegativeSpace( 'lg' );
		await toggleNegativeSpace( 'md' );
		await toggleNegativeSpace( 'sm' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should apply edged value correctly if the value is falsy', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'lg', '0' );
		await changeHeight( 'md', '' );
		await changeHeight( 'sm', '0' );
		await toggleNegativeSpace( 'sm' );
		await changeHeightUnit( 'sm', 'em' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should apply edged value correctly if the value is falsy and negative', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'lg', '0' );
		await changeHeight( 'md', '' );
		await changeHeight( 'sm', '0' );
		await toggleNegativeSpace( 'lg' );
		await toggleNegativeSpace( 'md' );
		await toggleNegativeSpace( 'sm' );
		await changeHeightUnit( 'sm', 'em' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be converted to core spacer block', async () => {
		await insertBlock( 'Flexible Spacer' );
		await transformBlockTo( 'Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be converted to core spacer block by keeping desktop height', async () => {
		await insertBlock( 'Flexible Spacer' );
		await openSidebar();
		await changeHeight( 'lg', '200' );
		await changeHeightUnit( 'lg', 'em' );
		await toggleNegativeSpace( 'lg' );
		await transformBlockTo( 'Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be converted to flexible spacer block', async () => {
		await insertBlock( 'Spacer' );
		await transformBlockTo( 'Flexible Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be converted to flexible spacer block by keeping height', async () => {
		await insertBlock( 'Spacer' );
		await openSidebar();
		await inputValue( '.block-editor-block-inspector input[type="number"]', '200' );
		await transformBlockTo( 'Flexible Spacer' );

		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );

describe( 'Setting', () => {
	describe( 'breakpoints', () => {
		it( 'should be saved', async () => {
			await switchUserToAdmin();
			const smSelector = 'input[name="flexible_spacer_block_breakpoint[sm]"]';
			const mdSelector = 'input[name="flexible_spacer_block_breakpoint[md]"]';
			const submitButton = 'input[id="submit"]';

			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );
			await inputValue( smSelector, 500 );
			await inputValue( mdSelector, 1000 );
			await page.click( submitButton );

			const smValue = await page.$eval( smSelector, ( element ) => element.value );
			const mdValue = await page.$eval( mdSelector, ( element ) => element.value );

			expect( smValue ).toBe( '500' );
			expect( mdValue ).toBe( '1000' );
		} );

		it( 'should show error if the values are invalid', async () => {
			await switchUserToAdmin();
			const smSelector = 'input[name="flexible_spacer_block_breakpoint[sm]"]';
			const mdSelector = 'input[name="flexible_spacer_block_breakpoint[md]"]';
			const submitButton = 'input[id="submit"]';

			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );

			await inputValue( smSelector, '' );
			await inputValue( mdSelector, '' );
			await page.click( submitButton );

			// Null values
			await expect( page ).toMatchElement( '#setting-error-flexible-spacer-block-breakpoint-null' );

			await inputValue( smSelector, 1000 );
			await inputValue( mdSelector, 500 );
			await page.click( submitButton );

			// The screen width value in the left field is larger than the value in the right field
			await expect( page ).toMatchElement(
				'#setting-error-flexible-spacer-block-breakpoint-compare'
			);
		} );
	} );

	describe( 'default values', () => {
		it( 'should be saved', async () => {
			await switchUserToAdmin();
			const smSelector = 'input[name="flexible_spacer_block_default_value[sm]"]';
			const mdSelector = 'input[name="flexible_spacer_block_default_value[md]"]';
			const smUnitSelector = 'select[name="flexible_spacer_block_default_value[sm_unit]"]';
			const mdUnitSelector = 'select[name="flexible_spacer_block_default_value[md_unit]"]';
			const submitButton = 'input[id="submit"]';

			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );
			await inputValue( smSelector, 300 );
			await inputValue( mdSelector, 500 );
			await page.select( smUnitSelector, '%' );
			await page.select( mdUnitSelector, 'em' );
			await page.click( submitButton );

			const smValue = await page.$eval( smSelector, ( element ) => element.value );
			const mdValue = await page.$eval( mdSelector, ( element ) => element.value );
			const smUnitValue = await page.$eval( smUnitSelector, ( element ) => element.value );
			const mdUnitValue = await page.$eval( mdUnitSelector, ( element ) => element.value );

			expect( smValue ).toBe( '300' );
			expect( mdValue ).toBe( '500' );
			expect( smUnitValue ).toBe( '%' );
			expect( mdUnitValue ).toBe( 'em' );

			// Finally update with default values.
			await inputValue( smSelector, 100 );
			await inputValue( mdSelector, 100 );
			await page.select( smUnitSelector, 'px' );
			await page.select( mdUnitSelector, 'px' );
			await page.click( submitButton );
		} );
	} );

	describe( 'block editor setting', () => {
		it( 'should be toggled', async () => {
			await switchUserToAdmin();
			const selector = `input[name="flexible_spacer_block_show_block"]`;
			const submitButton = 'input[id="submit"]';

			await visitAdminPage( 'options-general.php', 'page=flexible-spacer-block-option' );

			const currentCheckbox = await page.$( selector );
			const currentChecked = await ( await currentCheckbox.getProperty( 'checked' ) ).jsonValue();

			await page.click( selector );
			await page.click( submitButton );

			const newCheckbox = await page.$( selector );
			const newChecked = await ( await newCheckbox.getProperty( 'checked' ) ).jsonValue();

			expect( newChecked ).toBe( ! currentChecked );
		} );
	} );
} );
