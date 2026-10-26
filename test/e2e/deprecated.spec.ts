/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Deprecated', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyfive' );
	} );

	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should migrate numeric heights from v1 to heights with a unit', async ( { editor } ) => {
		// Markup saved by v1, where the heights were stored as numbers without a unit.
		const content = `<!-- wp:fsb/flexible-spacer {"heightMd":150,"heightSm":0,"isNegativeMd":true} -->
<div aria-hidden="true" class="wp-block-fsb-flexible-spacer fsb-flexible-spacer"><div class="fsb-flexible-spacer__device fsb-flexible-spacer__device--lg" style="height:100px"></div><div class="fsb-flexible-spacer__device fsb-flexible-spacer__device--md" style="margin-bottom:-150px"></div><div class="fsb-flexible-spacer__device fsb-flexible-spacer__device--sm" style="height:0"></div></div>
<!-- /wp:fsb/flexible-spacer -->`;
		await editor.setContent( content );

		expect( await editor.getBlocks( { full: true } ) ).toMatchObject( [
			{
				name: 'fsb/flexible-spacer',
				isValid: true,
				attributes: {
					heightLg: '100px',
					heightMd: '150px',
					heightSm: '0px',
					isNegativeLg: false,
					isNegativeMd: true,
					isNegativeSm: false,
				},
			},
		] );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );
} );
