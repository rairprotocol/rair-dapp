
import { put, call, takeLatest } from "redux-saga/effects";
import * as types from "./types";
import { headers } from "../../utils/headers";
import { getListVideosError, getVideoListComplete } from "./actions";
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from "axios";
import { TMediaList } from "../../axios.responseTypes";

export function* getVideos() {
    try {
        const videos: AxiosResponse<TMediaList> = yield call<(url: string, config: AxiosRequestHeaders ) => any>(
            axios.get,
            `/api/media/list`, 
            headers()
        );
        if (videos !== undefined && videos.status === 200) {
            yield put(getVideoListComplete(videos.data.list));
        }
    } catch (error) {
        const errors = error as AxiosError;
        if (errors.response !== undefined) {
            if (errors.response.status === 404) {
                const errorDirec = "This address does not exist";
                yield put(getListVideosError(errorDirec));
            } else if (errors.response.status === 500) {
                const errorServer =
                    "Sorry. an internal server problem has occurred";
                yield put(getListVideosError(errorServer));
            } else {
                yield put(getListVideosError(errors.response.data.message));
            }
        } else {
            const errorConex = "Connection error!";
            yield put(getListVideosError(errorConex));
        }
    }
}

export function* sagaVideos() {
    yield takeLatest(types.GET_LIST_VIDEOS_START, getVideos);
}