import { UserReducerActionTypes } from './actions';
import * as types from './types';

export type InitialUsersStateType = {
    userRd: null,
    error: null,
    adminRights: undefined
}

const InitialState: InitialUsersStateType = {
    userRd: null,
    error: null,
    adminRights: undefined
};

export default function userStore(state: InitialUsersStateType = InitialState, action: UserReducerActionTypes) {
    switch (action.type) {
        case types.GET_USER_START:
            return {
                ...state,
                userRd: null
            };
        case types.SET_ADMIN_RIGHTS:
            return {
                ...state,
                adminRights: action.adminRights
            };
        case types.GET_USER_COMPLETE:
            return {
                ...state,
                userRd: action.userRd
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
