/**
 * External dependencies
 */
import { describe, expect, it } from 'vitest';

/**
 * Internal dependencies
 */
import { getStyleObject, getTransformedHeight } from './utils';

describe( 'getStyleObject', () => {
	it.each( [ undefined, '' ] )(
		'falls back to the default value when the value is %j',
		( value ) => {
			expect( getStyleObject( value, false, '100', 'px' ) ).toEqual( { height: '100px' } );
			expect( getStyleObject( value, true, '2', 'em' ) ).toEqual( { marginBottom: '-2em' } );
		}
	);

	it.each( [ '0', '0px', '0em' ] )(
		'returns a zero height for %j even as negative space',
		( value ) => {
			const expected = { height: value === '0' ? '0px' : value };
			expect( getStyleObject( value, false, '100', 'px' ) ).toEqual( expected );
			expect( getStyleObject( value, true, '100', 'px' ) ).toEqual( expected );
		}
	);

	it( 'converts a spacing preset to its CSS custom property', () => {
		expect( getStyleObject( 'var:preset|spacing|50', false, '100', 'px' ) ).toEqual( {
			height: 'var(--wp--preset--spacing--50)',
		} );
	} );

	it( 'negates a spacing preset for negative space', () => {
		expect( getStyleObject( 'var:preset|spacing|50', true, '100', 'px' ) ).toEqual( {
			marginBottom: 'calc(-1 * var(--wp--preset--spacing--50))',
		} );
	} );

	it( 'returns a custom value as the height', () => {
		expect( getStyleObject( '50px', false, '100', 'px' ) ).toEqual( { height: '50px' } );
	} );

	it( 'returns a custom value as a negative margin for negative space', () => {
		expect( getStyleObject( '50px', true, '100', 'px' ) ).toEqual( { marginBottom: '-50px' } );
		expect( getStyleObject( '1.5rem', true, '100', 'px' ) ).toEqual( {
			marginBottom: '-1.5rem',
		} );
	} );
} );

describe( 'getTransformedHeight', () => {
	it.each( [ undefined, '' ] )(
		'falls back to the default height when the height is %j',
		( height ) => {
			expect( getTransformedHeight( height ) ).toBe( '100px' );
		}
	);

	// The "None" preset is stored as a bare `0`.
	it.each( [ 'var:preset|spacing|50', '0' ] )(
		'keeps the spacing preset %j as it is',
		( height ) => {
			expect( getTransformedHeight( height ) ).toBe( height );
		}
	);

	it( 'adds the default unit to a number without a unit', () => {
		expect( getTransformedHeight( '50' ) ).toBe( '50px' );
	} );

	it.each( [ '50px', '2em', '1.5rem', '10vh' ] )( 'keeps %j as it is', ( height ) => {
		expect( getTransformedHeight( height ) ).toBe( height );
	} );
} );
