import * as types from './types';

const updateTokenMetadataAC = (url: string, formData: any) =>
  ({
    type: types.UPDATE_TOKEN_METADATA,
    url,
    formData
  }) as const;
const setShowSidebarFalse = () => ({ type: types.SHOW_SIDEBAR_FALSE }) as const;
const setShowSidebarTrue = () => ({ type: types.SHOW_SIDEBAR_TRUE }) as const;
const updateTokenMetadataError = (errorMessage: string | null) =>
  ({ type: types.UPDATE_TOKEN_METADATA_ERROR, errorMessage }) as const;

export {
  setShowSidebarFalse,
  setShowSidebarTrue,
  updateTokenMetadataAC,
  updateTokenMetadataError
};
