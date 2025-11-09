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

	test( 'should be created', async ( { editor } ) => {
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
