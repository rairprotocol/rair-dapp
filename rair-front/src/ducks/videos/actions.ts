import * as types from './types';
import { TUpdataVideoParams } from './videosDucks.types';

import { MediaListResponseType } from '../../components/video/video.types';

const getListVideosStart = (params: TUpdataVideoParams) =>
  ({
    type: types.GET_LIST_VIDEOS_START,
    params
  }) as const;

const setLoading = (loading: boolean) =>
  ({ type: types.SET_LOADING, loading }) as const;

const getVideoListComplete = (videoList: MediaListResponseType | null) =>
  ({ type: types.GET_LIST_VIDEOS_COMPLETE, videoList }) as const;

const getVideoListTotalClear = () =>
  ({
    type: types.GET_LIST_VIDEOS_TOTAL_CLEAR
  }) as const;

const getVideoListTotal = (totalNumberVideo: number) =>
  ({ type: types.GET_LIST_VIDEOS_TOTAL, totalNumberVideo }) as const;

const getListVideosError = (error: string | null) =>
  ({ type: types.GET_LIST_VIDEOS_ERROR, error }) as const;

export {
  getListVideosError,
  getListVideosStart,
  getVideoListComplete,
  getVideoListTotal,
  getVideoListTotalClear,
  setLoading
};
