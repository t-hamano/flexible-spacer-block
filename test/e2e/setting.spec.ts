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
			await page.locator( smSelector ).fill( '500' );
			await page.locator( mdSelector ).fill( '1000' );
			await page.locator( submitButton ).click();
			await expect( page.locator( smSelector ) ).toHaveValue( '500' );
			await expect( page.locator( mdSelector ) ).toHaveValue( '1000' );
		} );

		test( 'should show error if the values are invalid', async ( { admin, page } ) => {
			const smSelector = 'input[name="flexible_spacer_block_breakpoint[sm]"]';
			const mdSelector = 'input[name="flexible_spacer_block_breakpoint[md]"]';

			await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
			await page.locator( smSelector ).fill( '' );
			await page.locator( mdSelector ).fill( '' );
			await page.locator( submitButton ).click();

			// Null values
			await expect(
				page.locator( '#setting-error-flexible-spacer-block-breakpoint-null' )
			).toBeVisible();

			await page.locator( smSelector ).fill( '1000' );
			await page.locator( mdSelector ).fill( '500' );
			await page.locator( submitButton ).click();

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
		await page.locator( smSelector ).fill( '300' );
		await page.locator( mdSelector ).fill( '500' );
		await page.locator( smUnitSelector ).selectOption( '%' );
		await page.locator( mdUnitSelector ).selectOption( 'em' );
		await page.locator( submitButton ).click();

		await expect( page.locator( smSelector ) ).toHaveValue( '300' );
		await expect( page.locator( mdSelector ) ).toHaveValue( '500' );
		await expect( page.locator( smUnitSelector ) ).toHaveValue( '%' );
		await expect( page.locator( mdUnitSelector ) ).toHaveValue( 'em' );

		// Finally update with default values.
		await page.locator( smSelector ).fill( '100' );
		await page.locator( mdSelector ).fill( '100' );
		await page.locator( smUnitSelector ).selectOption( 'px' );
		await page.locator( mdUnitSelector ).selectOption( 'px' );
		await page.locator( submitButton ).click();
	} );

	test( 'block editor should be toggled', async ( { admin, page } ) => {
		const selector = `input[name="flexible_spacer_block_show_block"]`;
		await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
		const currentCheckbox = page.locator( selector );
		const currentChecked = await currentCheckbox.evaluate(
			( element: HTMLInputElement ) => element.checked
		);
		await currentCheckbox.click();
		await page.locator( submitButton ).click();
		const newCheckbox = page.locator( selector );
		const newChecked = await newCheckbox.evaluate(
			( element: HTMLInputElement ) => element.checked
		);
		expect( newChecked ).toBe( ! currentChecked );
	} );
} );
