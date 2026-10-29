/**
 * WordPress dependencies
 */
import { test, expect, type Admin } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Default value', () => {
	const submitButton = 'input[id="submit"]';

	async function saveDefaultValues( admin: Admin, values: Record< string, [ string, string ] > ) {
		const { page } = admin;
		await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
		for ( const [ device, [ quantity, unit ] ] of Object.entries( values ) ) {
			await page
				.locator( `input[name="flexible_spacer_block_default_value[${ device }]"]` )
				.fill( quantity );
			await page
				.locator( `select[name="flexible_spacer_block_default_value[${ device }_unit]"]` )
				.selectOption( unit );
		}
		await page.locator( submitButton ).click();
		await expect( page.locator( '#setting-error-settings_updated' ) ).toBeVisible();
	}

	// Restore the initial settings so that other tests do not depend on the execution order.
	test.afterEach( async ( { admin } ) => {
		await saveDefaultValues( admin, {
			sm: [ '100', 'px' ],
			md: [ '100', 'px' ],
			lg: [ '100', 'px' ],
		} );
	} );

	test( 'should be applied to a newly inserted block', async ( { admin, editor, page } ) => {
		await saveDefaultValues( admin, {
			sm: [ '50', '%' ],
			md: [ '10', 'em' ],
			lg: [ '200', 'px' ],
		} );

		await admin.createNewPost();
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );

		await expect
			.poll( async () => ( await editor.getBlocks() )[ 0 ].attributes )
			.toMatchObject( {
				heightLg: '200px',
				heightMd: '10em',
				heightSm: '50%',
			} );

		await editor.openDocumentSettingsSidebar();
		await expect( page.getByRole( 'spinbutton', { name: 'Desktop height' } ) ).toHaveValue( '200' );
		await expect( page.getByRole( 'spinbutton', { name: 'Tablet height' } ) ).toHaveValue( '10' );
		await expect( page.getByRole( 'spinbutton', { name: 'Mobile height' } ) ).toHaveValue( '50' );
	} );
} );
