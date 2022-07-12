import * as types from './types';
import { TVideosActions, TVideosInitialState } from './videosDucks.types';

const InitialState: TVideosInitialState = {
  videos: null,
  error: null,
  totalNumberVideo: null,
  refresh: false,
  loading: false
};

export default function videosStore(
  state: TVideosInitialState = InitialState,
  action: TVideosActions
): TVideosInitialState {
  switch (action.type) {
    case types.GET_LIST_VIDEOS_START:
      return {
        ...state,
        videos: null,
        loading: true
      };
    case types.GET_LIST_VIDEOS_COMPLETE:
      return {
        ...state,
        videos: action.videoList,
        loading: false
      };
    case types.GET_LIST_VIDEOS_TOTAL_CLEAR:
      return {
        ...state,
        totalNumberVideo: null
      };
    case types.GET_LIST_VIDEOS_TOTAL:
      return {
        ...state,
        loading: false,
        totalNumberVideo: action.totalNumberVideo
      };
    case types.GET_LIST_VIDEOS_ERROR:
      return {
        ...state,
        videos: null,
        error: action.error
      };
    case types.REFRESH_LIST_VIDEOS:
      return {
        ...state,
        refresh: action.refresh
      };
    default:
      return state;
  }
}
