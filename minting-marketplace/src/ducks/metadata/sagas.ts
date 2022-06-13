// @ts-nocheck
import axios, { AxiosError } from "axios";
import { put, takeLatest } from "redux-saga/effects";
import { token } from "../../utils/getToken";
import * as types from "./types";

export function* updateTokenMetadata({url, formData}) {
    try {
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-rair-token': `${token}`
            },
        }).then(res => res.data)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
        
    } catch (error) {
        const errors = error as AxiosError;
        if (errors.response !== undefined) {
            if (errors.response.status === 404) {
                const errorDirec = "This address does not exist";
                yield put({
                    type: types.UPDATE_TOKEN_METADATA_ERROR,
                    error: errorDirec,
                });
            } else if (errors.response.status === 500) {
                const errorServer =
                    "Sorry. an internal server problem has occurred";
                yield put({
                    type: types.UPDATE_TOKEN_METADATA_ERROR,
                    error: errorServer,
                });
            } else {
                yield put({
                    type: types.UPDATE_TOKEN_METADATA_ERROR,
                    error: errors.response.data.message,
                });
            }
        } else {
            const errorConex = "Connection error!";
            yield put({ type: types.UPDATE_TOKEN_METADATA_ERROR, error: errorConex });
        }
    }
}

export function* sagaMetadata() {
    yield takeLatest(types.UPDATE_TOKEN_METADATA, updateTokenMetadata);
}