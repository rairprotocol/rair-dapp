import {
  setShowSidebarFalse,
  setShowSidebarTrue,
  updateTokenMetadataAC,
  updateTokenMetadataError
} from './actions';

export type TMetadataInitialType = {
  showSidebar: boolean;
  errorMessage: string | null;
};

export type TSetShowSidebarTrue = ReturnType<typeof setShowSidebarTrue>;
export type TSetShowSidebarFalse = ReturnType<typeof setShowSidebarFalse>;
export type TUpdateTokenMetadata = ReturnType<typeof updateTokenMetadataAC>;
export type TUpdateTokenMetadataError = ReturnType<
  typeof updateTokenMetadataError
>;

export type TMetadataActions =
  | TSetShowSidebarTrue
  | TSetShowSidebarFalse
  | TUpdateTokenMetadata
  | TUpdateTokenMetadataError;
