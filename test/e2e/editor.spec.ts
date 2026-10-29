/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Block', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyfive' );
	} );

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
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 0 ).check();
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 1 ).check();
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 2 ).check();
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
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 0 ).check();
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 1 ).check();
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 2 ).check();
		await page.getByRole( 'combobox', { name: 'Select unit' } ).nth( 3 ).selectOption( 'em' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should apply spacing presets to each device', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'button', { name: 'Use preset' } ).nth( 3 ).click();
		await page.getByRole( 'button', { name: 'Use preset' } ).nth( 2 ).click();
		await page.getByRole( 'button', { name: 'Use preset' } ).nth( 1 ).click();
		await page.getByRole( 'slider', { name: 'Desktop height' } ).fill( '4' );
		await page.getByRole( 'slider', { name: 'Tablet height' } ).fill( '2' );
		await page.getByRole( 'slider', { name: 'Mobile height' } ).fill( '1' );
		await page.getByRole( 'slider', { name: 'Mobile height' } ).fill( '0' );
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 1 ).check();
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 2 ).check();
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should switch each device control to the preset view when all heights uses a preset', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'button', { name: 'Use preset' } ).nth( 0 ).click();
		await page.getByRole( 'slider', { name: 'All heights' } ).fill( '4' );
		await expect( page.getByRole( 'spinbutton', { name: 'Desktop height' } ) ).toBeHidden();
		await expect( page.getByRole( 'spinbutton', { name: 'Tablet height' } ) ).toBeHidden();
		await expect( page.getByRole( 'spinbutton', { name: 'Mobile height' } ) ).toBeHidden();
	} );

	test( 'should empty the all heights control when a device height diverges', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( {
			name: 'fsb/flexible-spacer',
			attributes: {
				heightLg: 'var:preset|spacing|50',
				heightMd: 'var:preset|spacing|50',
				heightSm: 'var:preset|spacing|50',
			},
		} );
		await editor.openDocumentSettingsSidebar();
		await page.getByRole( 'slider', { name: 'Desktop height' } ).fill( '2' );
		await expect( page.getByRole( 'spinbutton', { name: 'All heights' } ) ).toHaveValue( '' );
	} );

	test( 'should change the height with the resize handle', async ( { editor, page } ) => {
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		const handle = editor.canvas.locator(
			'.fsb-flexible-spacer__device--md .components-resizable-box__handle'
		);
		const { x, y, width, height } = ( await handle.boundingBox() )!;
		await page.mouse.move( x + width / 2, y + height / 2 );
		await page.mouse.down();
		await page.mouse.move( x + width / 2, y + height / 2 + 50, { steps: 10 } );
		await page.mouse.up();

		// Only the height of the resized device changes.
		await expect
			.poll( async () => ( await editor.getBlocks() )[ 0 ].attributes )
			.toMatchObject( { heightLg: '100px', heightMd: '150px', heightSm: '100px' } );
	} );

	test( 'should share the responsive view across blocks', async ( { editor, page } ) => {
		// Make the editor canvas wide enough to show the desktop height.
		await page.setViewportSize( { width: 1600, height: 900 } );
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		await editor.insertBlock( { name: 'fsb/flexible-spacer' } );
		const blocks = editor.canvas.getByRole( 'document', { name: 'Block: Flexible Spacer' } );
		const toolbar = page.getByRole( 'toolbar', { name: 'Block tools' } );

		async function expectDisplayedDevices( devices: string[] ) {
			for ( const block of [ blocks.nth( 0 ), blocks.nth( 1 ) ] ) {
				for ( const device of [ 'lg', 'md', 'sm' ] ) {
					await expect( block.locator( `.fsb-flexible-spacer__device--${ device }` ) ).toHaveCSS(
						'display',
						devices.includes( device ) ? 'block' : 'none'
					);
				}
			}
		}

		await expectDisplayedDevices( [ 'lg', 'md', 'sm' ] );

		await toolbar.getByRole( 'button', { name: 'Enable responsive view' } ).click();
		await expectDisplayedDevices( [ 'lg' ] );

		// The other block uses the same state.
		await editor.selectBlocks( blocks.nth( 0 ) );
		await expect(
			toolbar.getByRole( 'button', { name: 'Disable responsive view' } )
		).toHaveAttribute( 'aria-pressed', 'true' );

		await toolbar.getByRole( 'button', { name: 'Disable responsive view' } ).click();
		await expectDisplayedDevices( [ 'lg', 'md', 'sm' ] );
	} );

	test( 'should change the height with the range control if custom spacing sizes are disabled', async ( {
		editor,
		page,
	} ) => {
		await page.evaluate( () =>
			window.wp.data
				.dispatch( 'core/block-editor' )
				.updateSettings( { disableCustomSpacingSizes: true } )
		);
		await editor.insertBlock( {
			name: 'fsb/flexible-spacer',
			attributes: { heightLg: '10em', heightMd: '100px', heightSm: '100px' },
		} );
		await editor.openDocumentSettingsSidebar();

		await expect( page.getByRole( 'slider', { name: 'Desktop height' } ) ).toHaveValue( '10' );
		await expect( page.getByRole( 'button', { name: 'Use preset' } ) ).toHaveCount( 0 );

		// The current unit is kept, and px is used when there is none.
		await page.getByRole( 'spinbutton', { name: 'Desktop height' } ).fill( '20' );
		await expect
			.poll( async () => ( await editor.getBlocks() )[ 0 ].attributes )
			.toMatchObject( { heightLg: '20em', heightMd: '100px', heightSm: '100px' } );
		await page.getByRole( 'spinbutton', { name: 'All heights' } ).fill( '30' );
		await expect
			.poll( async () => ( await editor.getBlocks() )[ 0 ].attributes )
			.toMatchObject( { heightLg: '30px', heightMd: '30px', heightSm: '30px' } );
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
		await page.getByRole( 'switch', { name: 'Negative space' } ).nth( 0 ).check();
		await editor.transformBlockTo( 'core/spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to core spacer block by keeping spacing preset', async ( {
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'fsb/flexible-spacer',
			attributes: {
				heightLg: 'var:preset|spacing|50',
				heightMd: 'var:preset|spacing|30',
				heightSm: '150px',
			},
		} );
		await editor.transformBlockTo( 'core/spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to core spacer block by keeping metadata and CSS', async ( {
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'fsb/flexible-spacer',
			attributes: {
				metadata: {
					name: 'My Spacer',
					blockVisibility: { viewport: { mobile: false } },
				},
				style: { css: 'background: red;' },
			},
		} );
		await editor.transformBlockTo( 'core/spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to flexible spacer block', async ( { editor } ) => {
		await editor.insertBlock( { name: 'core/spacer' } );
		await editor.transformBlockTo( 'fsb/flexible-spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to flexible spacer block by keeping height', async ( { editor } ) => {
		await editor.insertBlock( {
			name: 'core/spacer',
			attributes: { height: '200px' },
		} );
		await editor.transformBlockTo( 'fsb/flexible-spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to flexible spacer block by keeping spacing preset', async ( {
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'core/spacer',
			attributes: { height: 'var:preset|spacing|50' },
		} );
		await editor.transformBlockTo( 'fsb/flexible-spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );

	test( 'should be converted to flexible spacer block by keeping metadata and CSS', async ( {
		editor,
	} ) => {
		await editor.insertBlock( {
			name: 'core/spacer',
			attributes: {
				metadata: {
					name: 'My Spacer',
					blockVisibility: { viewport: { mobile: false } },
				},
				style: { css: 'background: red;' },
			},
		} );
		await editor.transformBlockTo( 'fsb/flexible-spacer' );
		expect( await editor.getEditedPostContent() ).toMatchSnapshot();
	} );
} );
