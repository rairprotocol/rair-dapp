import {
  GET_USER_COMPLETE,
  GET_USER_ERROR,
  GET_USER_START,
  LOGIN_PROCESS_UPDATE,
  LOGIN_STATUS_UPDATE,
  SET_ADMIN_RIGHTS,
  SET_LOGIN_TYPE,
  SET_SUPER_ADMIN,
  SET_USER_DATA
} from './types';
import { TUsersInitialState, UserReducerActionTypes } from './users.types';

const InitialState: TUsersInitialState = {
  userRd: null,
  error: null,
  adminRights: undefined,
  superAdmin: undefined,
  loginProcess: false,
  loggedIn: false,
  userData: undefined,
  loginType: undefined
};

export default function userStore(
  state: TUsersInitialState = InitialState,
  action: UserReducerActionTypes
): TUsersInitialState {
  switch (action.type) {
    case LOGIN_STATUS_UPDATE:
      return {
        ...state,
        loggedIn: action.value
      };
    case LOGIN_PROCESS_UPDATE:
      return {
        ...state,
        loginProcess: action.value
      };
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.userData
      };
    case SET_LOGIN_TYPE:
      return {
        ...state,
        loginType: action.loginType
      };
    case GET_USER_START:
      return {
        ...state,
        userRd: null
      };
    case SET_ADMIN_RIGHTS:
      return {
        ...state,
        adminRights: action.adminRights
      };
    case SET_SUPER_ADMIN:
      return {
        ...state,
        superAdmin: action.superAdmin
      };
    case GET_USER_COMPLETE:
      return {
        ...state,
        userRd: action.userRd
      };
    case GET_USER_ERROR:
      return {
        ...state,
        userRd: null,
        error: action.error
      };
    default:
      return state;
  }
}
