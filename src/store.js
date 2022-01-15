/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';

const DEFAULT_STATE = {
	isResponsive: false,
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	if ( action.type === 'UPDATE_IS_RESPONSIVE' ) {
		return {
			...state,
			isResponsive: ! state.isResponsive,
		};
	}

	return state;
};

const actions = {
	setIsResponsive( value ) {
		return {
			type: 'UPDATE_IS_RESPONSIVE',
			value,
		};
	},
};

const selectors = {
	getIsResponsive( state ) {
		return state.isResponsive;
	},
};

registerStore( 'flexible-spacer-block', {
	reducer,
	actions,
	selectors,
} );
