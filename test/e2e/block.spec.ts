/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Block', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'should be created', async ( { editor } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should change all height', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'spinbutton', { name: 'All heights' } ).fill( '200' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should change all height unit', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 0 ).selectOption( 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should change each height', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'spinbutton', { name: 'Desktop height' } ).fill( '200' );
		await page.getByRole( 'spinbutton', { name: 'Tablet height' } ).fill( '300' );
		await page.getByRole( 'spinbutton', { name: 'Mobile height' } ).fill( '400' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should change each height unit', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 1 ).selectOption( '%' );
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 2 ).selectOption( 'em' );
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 3 ).selectOption( 'rem' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should apply negative space', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'spinbutton', { name: 'Desktop height' } ).fill( '200' );
		await page.getByRole( 'spinbutton', { name: 'Tablet height' } ).fill( '300' );
		await page.getByRole( 'spinbutton', { name: 'Mobile height' } ).fill( '400' );
		await page.getByRole( 'checkbox', { name: 'Negative space' } ).nth( 0 ).check();
		await page.getByRole( 'checkbox', { name: 'Negative space' } ).nth( 1 ).check();
		await page.getByRole( 'checkbox', { name: 'Negative space' } ).nth( 2 ).check();
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should apply edged value correctly if the value is falsy', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'spinbutton', { name: 'Desktop height' } ).fill( '0' );
		await page.getByRole( 'spinbutton', { name: 'Tablet height' } ).fill( '' );
		await page.getByRole( 'spinbutton', { name: 'Mobile height' } ).fill( '0' );
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 3 ).selectOption( 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should apply edged value correctly if the value is falsy and negative', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'spinbutton', { name: 'Desktop height' } ).fill( '0' );
		await page.getByRole( 'spinbutton', { name: 'Tablet height' } ).fill( '' );
		await page.getByRole( 'spinbutton', { name: 'Mobile height' } ).fill( '0' );
		await page.getByRole( 'checkbox', { name: 'Negative space' } ).nth( 0 ).check();
		await page.getByRole( 'checkbox', { name: 'Negative space' } ).nth( 1 ).check();
		await page.getByRole( 'checkbox', { name: 'Negative space' } ).nth( 2 ).check();
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 3 ).selectOption( 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to core spacer block', async ( { editor } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.transformBlockTo( 'core/spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to core spacer block by keeping desktop height', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'spinbutton', { name: 'Desktop height' } ).fill( '200' );
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 1 ).selectOption( 'em' );
		await page.getByRole( 'checkbox', { name: 'Negative space' } ).nth( 0 ).check();
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
