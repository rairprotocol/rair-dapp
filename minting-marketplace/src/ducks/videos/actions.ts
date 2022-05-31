//@ts-nocheck
import * as types from './types';

const getVideos = () => ({
    type: types.GET_LIST_VIDEOS_START,
} as const);

const getVideoListComplete = (videoList) => ({ type: types.GET_LIST_VIDEOS_COMPLETE, videoList } as const );

const refreshAction = (refresh) => ({
    type: types.REFRESH_LIST_VIDEOS,
    refresh
} as const);

const getListVideosError = (error) => ({ type: types.GET_LIST_VIDEOS_ERROR, error } as const);

export {getListVideosError, getVideos, refreshAction, getVideoListComplete };