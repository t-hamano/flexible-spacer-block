/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Setting', () => {
	const submitButton = 'input[id="submit"]';

	test.describe( 'breakpoints', () => {
		test( 'should be saved', async ( { admin, page } ) => {
			const smSelector = 'input[name="flexible_spacer_block_breakpoint[sm]"]';
			const mdSelector = 'input[name="flexible_spacer_block_breakpoint[md]"]';

			await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
			await page.fill( smSelector, '500' );
			await page.fill( mdSelector, '1000' );
			await page.click( submitButton );
			await expect( page.locator( smSelector ) ).toHaveValue( '500' );
			await expect( page.locator( mdSelector ) ).toHaveValue( '1000' );
		} );

		test( 'should show error if the values are invalid', async ( { admin, page } ) => {
			const smSelector = 'input[name="flexible_spacer_block_breakpoint[sm]"]';
			const mdSelector = 'input[name="flexible_spacer_block_breakpoint[md]"]';

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
		const smSelector = 'input[name="flexible_spacer_block_default_value[sm]"]';
		const mdSelector = 'input[name="flexible_spacer_block_default_value[md]"]';
		const smUnitSelector = 'select[name="flexible_spacer_block_default_value[sm_unit]"]';
		const mdUnitSelector = 'select[name="flexible_spacer_block_default_value[md_unit]"]';

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
