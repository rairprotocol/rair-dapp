import axios, { AxiosError, AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getDataAllClear,
  getDataAllComplete,
  getDataAllEmpty
} from './actions';
import { TGetDataAllStart, TSearchDataResponseType } from './search.types';
import * as types from './types';

import { BackendResponse } from '../../axios.responseTypes';

export function* getAllInformationFromSearch(
  titleSearchDemo: TGetDataAllStart
) {
  try {
    if (titleSearchDemo.titleSearchDemo) {
      const titleSearchDemoEncoded = encodeURIComponent(
        titleSearchDemo.titleSearchDemo
      );

      const searchData: AxiosResponse<TSearchDataResponseType> = yield call(
        () => {
          return axios.get<TSearchDataResponseType>(
            `/api/search/${titleSearchDemoEncoded}`
          );
        }
      );

      //   if (searchData.data.data) {
      if (searchData.status === 200) {
        if (searchData.data.data) {
          yield put(getDataAllComplete(searchData.data.data));
        } else if (!searchData.data.data) {
          yield put(getDataAllClear());
        }
      }
    }
  } catch (errors) {
    const error = errors as AxiosError;
    console.error(error, 'error from sagas');
    const errorData: BackendResponse = error?.response?.data as BackendResponse;

    if (error.response !== undefined) {
      if (error.response.status === 404) {
        const errorDirec = 'Nothing can found';
        yield put(getDataAllEmpty(errorDirec));
      } else if (error.response.status === 500) {
        const errorServer = 'Sorry. an internal server problem has occurred';
        yield put(getDataAllEmpty(errorServer));
      } else {
        yield put(getDataAllEmpty(errorData.message));
      }
    } else {
      const errorConnection = 'Nothing can fiend error!';
      yield put(getDataAllEmpty(errorConnection));
    }
  }
}

export function* sagaAllInformationFromSearch() {
  yield takeLatest(types.GET_DATA_ALL_START, getAllInformationFromSearch);
}
