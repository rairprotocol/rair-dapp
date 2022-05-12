//@ts-nocheck
import { put, call, takeLatest } from "redux-saga/effects";
import * as types from "./types";
import { headers } from "../../utils/headers";

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
            yield put({
                type: types.GET_LIST_VIDEOS_COMPLETE,
                payload: videos.data.list,
            });
        }
    } catch (error) {
        if (error.response !== undefined) {
            if (error.response.status === 404) {
                const errorDirec = "This address does not exist";
                yield put({
                    type: types.GET_LIST_VIDEOS_ERROR,
                    error: errorDirec,
                });
            } else if (error.response.status === 500) {
                const errorServer =
                    "Sorry. an internal server problem has occurred";
                yield put({
                    type: types.GET_LIST_VIDEOS_ERROR,
                    error: errorServer,
                });
            } else {
                yield put({
                    type: types.GET_LIST_VIDEOS_ERROR,
                    error: error.response.data.message,
                });
            }
        } else {
            const errorConex = "Connection error!";
            yield put({ type: types.GET_LIST_VIDEOS_ERROR, error: errorConex });
        }
    }
}

export function* sagaVideos() {
    yield takeLatest(types.GET_LIST_VIDEOS_START, getVideos);
}