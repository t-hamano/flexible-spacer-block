/**
 * WordPress dependencies
 */
import { test, expect, type Admin } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Front-end', () => {
	const blockContent = `<!-- wp:fsb/flexible-spacer {"heightLg":"100px","heightMd":"200px","heightSm":"300px","isNegativeMd":true} -->
<div aria-hidden="true" class="wp-block-fsb-flexible-spacer fsb-flexible-spacer"><div class="fsb-flexible-spacer__device fsb-flexible-spacer__device--lg" style="height:100px"></div><div class="fsb-flexible-spacer__device fsb-flexible-spacer__device--md" style="margin-bottom:-200px"></div><div class="fsb-flexible-spacer__device fsb-flexible-spacer__device--sm" style="height:300px"></div></div>
<!-- /wp:fsb/flexible-spacer -->`;

	async function saveBreakpoints( admin: Admin, sm: string, md: string ) {
		const { page } = admin;
		await admin.visitAdminPage( '/options-general.php', `page=flexible-spacer-block-option` );
		await page.locator( 'input[name="flexible_spacer_block_breakpoint[sm]"]' ).fill( sm );
		await page.locator( 'input[name="flexible_spacer_block_breakpoint[md]"]' ).fill( md );
		await page.locator( 'input[id="submit"]' ).click();
		await expect( page.locator( '#setting-error-settings_updated' ) ).toBeVisible();
	}

	// Checks that only the device for the given viewport width is displayed.
	async function expectDisplayedDevice( page: Admin[ 'page' ], width: number, device: string ) {
		await page.setViewportSize( { width, height: 800 } );
		for ( const d of [ 'lg', 'md', 'sm' ] ) {
			await expect( page.locator( `.fsb-flexible-spacer__device--${ d }` ) ).toHaveCSS(
				'display',
				d === device ? 'block' : 'none'
			);
		}
	}

	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyfive' );
	} );

	// Restore the initial settings so that other tests do not depend on the execution order.
	test.afterEach( async ( { admin, requestUtils } ) => {
		await requestUtils.deleteAllPosts();
		await saveBreakpoints( admin, '599', '1024' );
	} );

	test( 'should output the styles for each device', async ( { page, requestUtils } ) => {
		const post = await requestUtils.createPost( {
			content: blockContent,
			status: 'publish',
			date_gmt: new Date().toISOString(),
		} );
		await page.goto( post.link );

		expect( await page.locator( '#fsb-flexible-spacer-style-inline-css' ).textContent() ).toContain(
			'@media screen and (min-width:1025px){.fsb-flexible-spacer__device--md,.fsb-flexible-spacer__device--sm{display:none;}}' +
				'@media screen and (min-width:600px) and (max-width:1024px){.fsb-flexible-spacer__device--lg,.fsb-flexible-spacer__device--sm{display:none;}}' +
				'@media screen and (max-width:599px){.fsb-flexible-spacer__device--lg,.fsb-flexible-spacer__device--md{display:none;}}'
		);

		await expectDisplayedDevice( page, 1025, 'lg' );
		await expectDisplayedDevice( page, 1024, 'md' );
		await expectDisplayedDevice( page, 600, 'md' );
		await expectDisplayedDevice( page, 599, 'sm' );

		// Negative space is output as a negative margin instead of a height.
		await expect( page.locator( '.fsb-flexible-spacer__device--md' ) ).toHaveCSS(
			'margin-bottom',
			'-200px'
		);
	} );

	test( 'should not output the tablet styles if both breakpoints are the same', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		await saveBreakpoints( admin, '800', '800' );
		const post = await requestUtils.createPost( {
			content: blockContent,
			status: 'publish',
			date_gmt: new Date().toISOString(),
		} );
		await page.goto( post.link );

		expect( await page.locator( '#fsb-flexible-spacer-style-inline-css' ).textContent() ).toContain(
			'@media screen and (min-width:801px){.fsb-flexible-spacer__device--md,.fsb-flexible-spacer__device--sm{display:none;}}' +
				'@media screen and (max-width:800px){.fsb-flexible-spacer__device--lg,.fsb-flexible-spacer__device--md{display:none;}}'
		);

		await expectDisplayedDevice( page, 801, 'lg' );
		await expectDisplayedDevice( page, 800, 'sm' );
	} );
} );
