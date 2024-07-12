import * as types from './types';

const uploadVideoStart = () => ({ type: types.UPLOAD_VIDEO_START }) as const;
const uploadVideoEnd = () => ({ type: types.UPLOAD_VIDEO_END }) as const;
const uploadVideoSuccess = () =>
  ({ type: types.UPLOAD_VIDEO_SUCCESS }) as const;
const getProviderError = (error: string | null) =>
  ({ type: types.UPLOAD_VIDEO_ERROR, error }) as const;

export {
  getProviderError,
  uploadVideoEnd,
  uploadVideoStart,
  uploadVideoSuccess
};
