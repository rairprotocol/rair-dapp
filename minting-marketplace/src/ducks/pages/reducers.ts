//@ts-nocheck
import * as types from './types';

const InitialState = {
    currentPage: 1,
    loading: null,
};

export default function getPageStore(state = InitialState, action) {
    switch (action.type) {
        case types.GET_CURRENT_PAGE_START:
            return {
                ...state,
                currentPage: action.currentPage,
                loading: true,
            }
        case types.GET_CURRENT_PAGE_COMPLETE:
            return {
                ...state,
                currentPage: action.payload,
                loading: false,
            }
        case types.GET_CURRENT_PAGE_END:
            return {
                ...state,
                currentPage: 1,
                loading: true,
            }
        default:
            return state;
    }
}
