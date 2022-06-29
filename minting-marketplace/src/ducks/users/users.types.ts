import {
  getUserComplete,
  getUserError,
  getUserStart,
  setAdminRights
} from './actions';

export type TUsersInitialState = {
  userRd: UserType | null;
  error: string | null;
  adminRights: boolean | undefined;
};

export type UserType = {
  adminNFT?: string;
  avatar: string | null;
  creationDate: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  nickName: string | null;
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
export type GetUserComplete = ReturnType<typeof getUserComplete>;
export type GetUserError = ReturnType<typeof getUserError>;

export type UserReducerActionTypes =
  | GetUsersType
  | SetAdminRights
  | GetUserComplete
  | GetUserError;
