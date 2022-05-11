//@ts-nocheck
import * as types from './types';

const InitialState = {
    userRd: null,
    error: null,
    adminRights: undefined
};

export default function userStore(state = InitialState, action) {
    switch (action.type) {
        case types.GET_USER_START:
            return {
                ...state,
                userRd: null
            };
        case types.SET_ADMIN_RIGHTS:
            return {
                ...state,
                adminRights: action.payload
            };
        case types.GET_USER_COMPLETE:
            return {
                ...state,
                userRd: action.payload
            };
        case types.GET_USER_ERROR:
            return {
                ...state,
                userRd: null,
                error: action.error
            }
        default:
            return state;
    }
}
