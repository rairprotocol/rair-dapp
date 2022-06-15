
import * as types from './types';
import { TVideosActions, TVideosInitialState } from './videosDucks.types';

const InitialState: TVideosInitialState = {
    videos: null,
    error: null,
    refresh: false,
};

export default function videosStore(state: TVideosInitialState = InitialState, action: TVideosActions): TVideosInitialState {
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
