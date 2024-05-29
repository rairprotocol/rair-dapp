import * as types from './types';
import { TVideosActions, TVideosInitialState } from './videosDucks.types';

const InitialState: TVideosInitialState = {
  videos: null,
  error: null,
  totalNumberVideo: undefined,
  loading: false
};

export default function videosStore(
  state: TVideosInitialState = InitialState,
  action: TVideosActions
): TVideosInitialState {
  switch (action.type) {
    case types.GET_LIST_VIDEOS_COMPLETE:
      return {
        ...state,
        videos: action.videoList
      };
    case types.GET_LIST_VIDEOS_TOTAL_CLEAR:
      return {
        ...state,
        totalNumberVideo: 0
      };
    case types.GET_LIST_VIDEOS_TOTAL:
      return {
        ...state,
        totalNumberVideo: action.totalNumberVideo
      };
    case types.GET_LIST_VIDEOS_ERROR:
      return {
        ...state,
        videos: null,
        error: action.error
      };

    case types.SET_LOADING:
      return {
        ...state,
        loading: action.loading
      };
    default:
      return state;
  }
}
