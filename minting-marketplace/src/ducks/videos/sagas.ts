//@ts-nocheck
import { put, call, takeLatest } from "redux-saga/effects";
import * as types from "./types";
import { headers } from "../../utils/headers";
import { getListVideosError, getVideoListComplete } from "./actions";

export function* getVideos() {
    try {
        const videos = yield call(
            fetch,
            `/api/media/list`,
            null,
            headers(),
            "GET"
        );
        if (videos !== undefined && videos.status === 200) {
            yield put(getVideoListComplete(videos.data.list));
        }
    } catch (error) {
        if (error.response !== undefined) {
            if (error.response.status === 404) {
                const errorDirec = "This address does not exist";
                yield put(getListVideosError(errorDirec));
            } else if (error.response.status === 500) {
                const errorServer =
                    "Sorry. an internal server problem has occurred";
                yield put(getListVideosError(errorServer));
            } else {
                yield put(getListVideosError(error.response.data.message));
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