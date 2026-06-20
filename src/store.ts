/**
 * WordPress dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

interface State {
	isResponsive: boolean;
}

type Action = { type: 'UPDATE_IS_RESPONSIVE'; value: boolean };

const DEFAULT_STATE: State = {
	isResponsive: false,
};

export const store = createReduxStore( 'flexible-spacer-block', {
	reducer: ( state: State = DEFAULT_STATE, action: Action ): State => {
		if ( action.type === 'UPDATE_IS_RESPONSIVE' ) {
			return {
				...state,
				isResponsive: ! state.isResponsive,
			};
		}
		return state;
	},
	selectors: {
		getIsResponsive( state: State ) {
			return state.isResponsive;
		},
	},
	actions: {
		setIsResponsive( value: boolean ) {
			return {
				type: 'UPDATE_IS_RESPONSIVE' as const,
				value,
			};
		},
	},
} );

register( store );
