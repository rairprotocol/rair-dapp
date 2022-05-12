//@ts-nocheck
import * as types from './types';

const getVideos = () => ({
    type: types.GET_LIST_VIDEOS_START,
});

const refreshAction = ({refresh}) => ({
    type: types.REFRESH_LIST_VIDEOS,
    refresh
});

export { getVideos, refreshAction }