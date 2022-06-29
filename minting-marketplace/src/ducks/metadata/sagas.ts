import axios, { AxiosError } from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { token } from '../../utils/getToken';
import { updateTokenMetadataError } from './actions';
import { TUpdateTokenMetadata } from './metadata.types';
import * as types from './types';

export function* updateTokenMetadata({ url, formData }) {
  try {
    axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-rair-token': `${token}`
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
    if (error.response !== undefined) {
      if (error.response.status === 404) {
        const errorDirec = 'This address does not exist';
        yield put(updateTokenMetadataError(errorDirec));
      } else if (error.response.status === 500) {
        const errorServer = 'Sorry. an internal server problem has occurred';
        yield put(updateTokenMetadataError(errorServer));
      } else {
        yield put(updateTokenMetadataError(error.response.data.message));
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
