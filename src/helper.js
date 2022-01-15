/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url';

/**
 * Returns the URL of a WPAdmin Page.
 *
 * @param  page
 * @param  query
 */
export function getWPAdminURL( page, query ) {
	return addQueryArgs( page, query );
}
