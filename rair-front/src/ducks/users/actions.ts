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
import { UserQueryType, UserType } from './users.types';

const setLoginType = (loginType: string) =>
  ({
    type: SET_LOGIN_TYPE,
    loginType
  }) as const;

const setUserData = (userData: UserQueryType) =>
  ({
    type: SET_USER_DATA,
    userData
  }) as const;

const setLoginProcessStatus = (value: boolean) =>
  ({
    type: LOGIN_PROCESS_UPDATE,
    value
  }) as const;

const setLogInStatus = (value: boolean) =>
  ({
    type: LOGIN_STATUS_UPDATE,
    value
  }) as const;

const getUserStart = (publicAddress: string) =>
  ({
    type: GET_USER_START,
    publicAddress: publicAddress
  }) as const;

const setAdminRights = (adminRights: boolean | undefined) =>
  ({
    type: SET_ADMIN_RIGHTS,
    adminRights
  }) as const;
const setSuperAdmin = (superAdmin: boolean | undefined) =>
  ({
    type: SET_SUPER_ADMIN,
    superAdmin
  }) as const;
const getUserComplete = (userRd: UserType | null) =>
  ({
    type: GET_USER_COMPLETE,
    userRd
  }) as const;
const getUserError = (error: string) =>
  ({
    type: GET_USER_ERROR,
    error
  }) as const;

export {
  getUserComplete,
  getUserError,
  getUserStart,
  setAdminRights,
  setLoginProcessStatus,
  setLogInStatus,
  setLoginType,
  setSuperAdmin,
  setUserData
};
