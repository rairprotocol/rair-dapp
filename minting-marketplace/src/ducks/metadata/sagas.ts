import axios, { AxiosError } from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

import { updateTokenMetadataError } from './actions';
import { TUpdateTokenMetadata } from './metadata.types';
import * as types from './types';

import { BackendResponse } from '../../axios.responseTypes';

export function* updateTokenMetadata({ url, formData }) {
  try {
    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => res.data)
      .then((response) => {
        console.info(response);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (errors) {
    const error = errors as AxiosError;
    const errorData: BackendResponse = error?.response?.data as BackendResponse;

    if (error.response !== undefined) {
      if (error.response.status === 404) {
        const errorDirec = 'This address does not exist';
        yield put(updateTokenMetadataError(errorDirec));
      } else if (error.response.status === 500) {
        const errorServer = 'Sorry. an internal server problem has occurred';
        yield put(updateTokenMetadataError(errorServer));
      } else {
        yield put(updateTokenMetadataError(errorData.message));
      }
    } else {
      const errorConex = 'Connection error!';
      yield put(updateTokenMetadataError(errorConex));
    }
  }
}

export function* sagaMetadata() {
  yield takeLatest<TUpdateTokenMetadata>(
    types.UPDATE_TOKEN_METADATA,
    updateTokenMetadata
  );
}
