import {
  getUserComplete,
  getUserError,
  getUserStart,
  setAdminRights,
  setSuperAdmin
} from './actions';

export type TUsersInitialState = {
  userRd: UserType | null;
  error: string | null;
  adminRights: boolean | undefined;
  superAdmin: boolean | undefined;
};

export type UserType = {
  adminNFT?: string;
  avatar: string | null;
  creationDate: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
  background: string | null;
  nonce?: string;
  publicAddress: string;
  _id: string;
};

export type UserResponseType = {
  succes: boolean;
  user: UserType;
};

export type GetUsersType = ReturnType<typeof getUserStart>;
export type SetAdminRights = ReturnType<typeof setAdminRights>;
export type SetSuperAdmin = ReturnType<typeof setSuperAdmin>;
export type GetUserComplete = ReturnType<typeof getUserComplete>;
export type GetUserError = ReturnType<typeof getUserError>;

export type UserReducerActionTypes =
  | GetUsersType
  | SetAdminRights
  | SetSuperAdmin
  | GetUserComplete
  | GetUserError;
