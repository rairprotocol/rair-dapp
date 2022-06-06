import { put, takeLatest } from "redux-saga/effects";
import { token } from "../../utils/getToken";
import * as types from "./types";

export function* updateTokenMetadata({url, formData}) {
    try {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-rair-token': `${token}`
            },
            body: formData
        }).then(res => res.json())
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        })
        
    } catch (error) {
        if (error.response !== undefined) {
            if (error.response.status === 404) {
                const errorDirec = "This address does not exist";
                yield put({
                    type: types.UPDATE_TOKEN_METADATA_ERROR,
                    error: errorDirec,
                });
            } else if (error.response.status === 500) {
                const errorServer =
                    "Sorry. an internal server problem has occurred";
                yield put({
                    type: types.UPDATE_TOKEN_METADATA_ERROR,
                    error: errorServer,
                });
            } else {
                yield put({
                    type: types.UPDATE_TOKEN_METADATA_ERROR,
                    error: error.response.data.message,
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