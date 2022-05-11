//@ts-nocheck
import { put, call, takeLatest } from "redux-saga/effects";
import * as types from "./types";

export function* getUser({ payload }) {
    try {
        const user = yield call(
            fetch,
            `/api/users/${payload.publicAddress}`,
            null,
            "GET"
        );
        if (user !== undefined && user.status === 200) {
            yield put({
                type: types.GET_USER_COMPLETE,
                payload: user.data.user,
            });
        }
    } catch (error) {
        if (error.response !== undefined) {
            if (error.response.status === 404) {
                const errorDirec = "This address does not exist";
                yield put({
                    type: types.GET_USER_ERROR,
                    error: errorDirec,
                });
            } else if (error.response.status === 500) {
                const errorServer =
                    "Sorry. an internal server problem has occurred";
                yield put({
                    type: types.GET_USER_ERROR,
                    error: errorServer,
                });
            } else {
                yield put({
                    type: types.GET_USER_ERROR,
                    error: error.response.data.message,
                });
            }
        } else {
            const errorConex = "Connection error!";
            yield put({ type: types.GET_USER_ERROR, error: errorConex });
        }
    }
}

export function* sagaUser() {
    yield takeLatest(types.GET_USER_START, getUser);
}