import * as types from './types';

const InitialState = {
  error: null,
  uploadVideo: false,
  successUploaded: false
};

export default function VideoDemoStore(state = InitialState, action) {
  switch (action.type) {
    case types.UPLOAD_VIDEO_START:
      return {
        ...state,
        uploadVideo: true,
        successUploaded: false
      };
    case types.UPLOAD_VIDEO_END:
      return {
        ...state,
        uploadVideo: false
      };

    case types.UPLOAD_VIDEO_SUCCESS:
      return {
        ...state,
        successUploaded: true
      };
    case types.UPLOAD_VIDEO_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
