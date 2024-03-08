/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_STATE = {
	isResponsive: false,
};

const store = createReduxStore( 'flexible-spacer-block', {
	reducer: ( state = DEFAULT_STATE, action ) => {
		if ( action.type === 'UPDATE_IS_RESPONSIVE' ) {
			return {
				...state,
				isResponsive: ! state.isResponsive,
			};
		}
		return state;
	},
	selectors: {
		getIsResponsive( state ) {
			return state.isResponsive;
		},
	},
	actions: {
		setIsResponsive( value ) {
			return {
				type: 'UPDATE_IS_RESPONSIVE',
				value,
			};
		},
	},
} );

register( store );
