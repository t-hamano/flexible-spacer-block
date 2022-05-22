/**
 * WordPress dependencies
 */
import { Path, SVG, Polygon } from '@wordpress/components';

export const blockIcon = (
	<SVG viewBox="0 0 24 24">
		<Polygon points="17.5,1.5 7.8,6.1 10.8,6.5 6.5,10.5 16.5,6 13.4,5.5 " />
		<Path d="M13.5,10.2v1.6h3.7L5.8,19.2V15H4.2v6.8H11v-1.6H6.8l11.4-7.4v3.7h1.6v-6.3H13.5z" />
	</SVG>
);

export const responsive = (
	<SVG viewBox="0 0 24 24">
		<Path
			d="M18.1,11.5H5.9l2.7-3.2L7.8,7.5L4,12l3.8,4.1l0.7-0.8L6,12.5h12.3L18.1,11.5z M18.1,12.5l-2.7,3.2l0.7,0.8L20,12l-3.8-4.1
	l-0.7,0.8l2.6,2.9"
		/>
		<Path d="M4.5,4.3v3H3V2.8h18v4.5h-1.5v-3C19.5,4.3,4.5,4.3,4.5,4.3z" />
		<Path d="M19.5,19.7v-3H21v4.5H3v-4.5h1.5v3H19.5z" />
	</SVG>
);
