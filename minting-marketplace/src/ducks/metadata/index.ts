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
		default:
			return state;
	}
}

export const setShowSidebarTrue = () => ({ type: types.SHOW_SIDEBAR_TRUE } as const);

export const setShowSidebarFalse = () => ({ type: types.SHOW_SIDEBAR_FALSE } as const);
