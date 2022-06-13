import { UserType } from "./sagas";
import * as types from "./types";

const getUser = () => ({
  type: types.GET_USER_START
} as const);

const setAdminRights = (adminRights: boolean | undefined) => ({
  type: types.SET_ADMIN_RIGHTS,
  adminRights,
} as const);
const getUserComplete = (userRd: UserType | null) => ({
  type: types.GET_USER_COMPLETE,
  userRd,
} as const);
const getUserError = (error: string) => ({
  type: types.GET_USER_ERROR,
  error,
} as const);

export { getUser, setAdminRights, getUserComplete, getUserError };

export type GetUsersType = ReturnType<typeof getUser>;
export type SetAdminRights = ReturnType<typeof setAdminRights>;
export type GetUserComplete = ReturnType<typeof getUserComplete>;
export type GetUserError = ReturnType<typeof getUserError>;

export type UserReducerActionTypes =
  | GetUsersType
  | SetAdminRights
  | GetUserComplete
  | GetUserError;