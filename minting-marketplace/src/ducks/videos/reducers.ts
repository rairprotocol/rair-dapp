//@ts-nocheck
import * as types from './types';

const InitialState = {
    videos: [],
    error: null,
    refresh: false,
};

export default function videosStore(state = InitialState, action) {
    switch (action.type) {
        case types.GET_LIST_VIDEOS_START:
            return {
                ...state,
                videos: null
            };
        case types.GET_LIST_VIDEOS_COMPLETE:
            return {
                ...state,
                videos: action.videoList
            };
        case types.GET_LIST_VIDEOS_ERROR:
            return {
                ...state,
                videos: null,
                error: action.error
            }
        case types.REFRESH_LIST_VIDEOS:
            return {
                ...state,
                refresh: action.refresh
            }
        default:
            return state;
    }
}
