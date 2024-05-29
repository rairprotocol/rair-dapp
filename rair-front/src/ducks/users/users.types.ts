import {
  getUserComplete,
  getUserError,
  getUserStart,
  setAdminRights,
  setLoginProcessStatus,
  setLogInStatus,
  setLoginType,
  setSuperAdmin,
  setUserData
} from './actions';

export type TUsersInitialState = {
  userRd: UserType | null;
  error: string | null;
  adminRights: boolean | undefined;
  superAdmin: boolean | undefined;
  loginProcess: boolean;
  loggedIn: boolean;
  userData: UserQueryType | undefined;
  loginType: string | undefined;
};

export type UserQueryType = {
  email: string;
  avatar: string | null;
  firstName: string | null;
  lastName: string | null;
  publicAddress: string;
  nickName: string | null;
  adminRights: boolean;
  superAdmin: boolean;
  ageVerified: boolean | undefined;
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
  ageVerified: boolean | undefined;
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

export type SetLoginProcessStatus = ReturnType<typeof setLoginProcessStatus>;
export type SetLogInStatus = ReturnType<typeof setLogInStatus>;
export type SetUserData = ReturnType<typeof setUserData>;
export type SetLoginType = ReturnType<typeof setLoginType>;

export type UserReducerActionTypes =
  | GetUsersType
  | SetAdminRights
  | SetSuperAdmin
  | GetUserComplete
  | GetUserError
  | SetLoginProcessStatus
  | SetLogInStatus
  | SetUserData
  | SetLoginType;
