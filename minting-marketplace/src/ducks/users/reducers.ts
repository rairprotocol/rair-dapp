import * as types from './types';
import { TUsersInitialState, UserReducerActionTypes } from './users.types';

const InitialState: TUsersInitialState = {
  userRd: null,
  error: null,
  adminRights: undefined
};

export default function userStore(
  state: TUsersInitialState = InitialState,
  action: UserReducerActionTypes
): TUsersInitialState {
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
      };
    default:
      return state;
  }
}
