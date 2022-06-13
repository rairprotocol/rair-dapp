//@ts-nocheck
import * as types from './types';

const InitialState = {
	showSidebar: true
}

export default function metadataStore(state = InitialState, action) {
	switch (action.type) {
		case types.SHOW_SIDEBAR_TRUE:
			return {
				...state,
				showSidebar: true
			};
		case types.SHOW_SIDEBAR_FALSE:

			return {
				...state,
				showSidebar: false
			};

		case types.UPDATE_TOKEN_METADATA_ERROR:

			return {
				...state,
				error_message: action.error
			};
		default:
			return state;
	}
}