import * as types from './types';
import { TUpdataVideoParams } from './videosDucks.types';

import { MediaListResponseType } from '../../components/video/video.types';

const getListVideosStart = (params: TUpdataVideoParams) =>
  ({
    type: types.GET_LIST_VIDEOS_START,
    params
  } as const);

const getVideoListComplete = (videoList: MediaListResponseType | null) =>
  ({ type: types.GET_LIST_VIDEOS_COMPLETE, videoList } as const);

const getVideoListTotalClear = () =>
  ({
    type: types.GET_LIST_VIDEOS_TOTAL_CLEAR
  } as const);

const getVideoListTotal = (totalNumberVideo: number) =>
  ({ type: types.GET_LIST_VIDEOS_TOTAL, totalNumberVideo } as const);

const refreshAction = (refresh: boolean) =>
  ({
    type: types.REFRESH_LIST_VIDEOS,
    refresh
  } as const);

const getListVideosError = (error: string | null) =>
  ({ type: types.GET_LIST_VIDEOS_ERROR, error } as const);

export {
  getListVideosError,
  getListVideosStart,
  getVideoListComplete,
  getVideoListTotal,
  getVideoListTotalClear,
  refreshAction
};
