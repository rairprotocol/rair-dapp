import * as types from './types';
import { UserType } from './users.types';

const getUserStart = (publicAddress: string) =>
  ({
    type: types.GET_USER_START,
    publicAddress: publicAddress
  } as const);

const setAdminRights = (adminRights: boolean | undefined) =>
  ({
    type: types.SET_ADMIN_RIGHTS,
    adminRights
  } as const);
const getUserComplete = (userRd: UserType | null) =>
  ({
    type: types.GET_USER_COMPLETE,
    userRd
  } as const);
const getUserError = (error: string) =>
  ({
    type: types.GET_USER_ERROR,
    error
  } as const);

export { getUserComplete, getUserError, getUserStart, setAdminRights };
