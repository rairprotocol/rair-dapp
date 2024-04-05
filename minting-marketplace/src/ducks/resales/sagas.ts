//@ts-nocheck
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getListResalesError,
  getResalesListComplete,
  getResalesListTotal
} from './actions';
import * as types from './types';

export function* getResales() {
  try {
    const resales: AxiosResponse<any> = yield call<
      (url: string, config: AxiosRequestHeaders) => any
    >(axios.get, `/api/resales/`);
    if (resales !== undefined && resales.status === 200) {
      yield put(getResalesListComplete(resales.data.data.doc));
      yield put(getResalesListTotal(resales.data.data.doc.length));
    }
  } catch (error) {
    const errors = error as AxiosError;
    if (errors.response !== undefined) {
      if (errors.response.status === 404) {
        const errorDirec = 'This address does not exist';
        yield put(getListResalesError(errorDirec));
      } else if (errors.response.status === 500) {
        const errorServer = 'Sorry. an internal server problem has occurred';
        yield put(getListResalesError(errorServer));
      } else {
        yield put(getListResalesError(errors.response.data.message));
      }
    } else {
      const errorConex = 'Connection error!';
      yield put(getListResalesError(errorConex));
    }
  }
}

export function* sagaResales() {
  yield takeLatest(types.GET_RESALES_LIST_START, getResales);
}
