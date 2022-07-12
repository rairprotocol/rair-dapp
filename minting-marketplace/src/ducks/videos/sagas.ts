//@ts-nocheck
// import { headers, paramsVideo } from "../../utils/headers";

import { put, call, takeLatest } from 'redux-saga/effects';
import * as types from './types';
import {
  getListVideosError,
  getVideoListComplete,
  getVideoListTotal
} from './actions';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { TMediaList } from '../../axios.responseTypes';

export function* getVideos({ params }) {
  try {
    const videos: AxiosResponse<TMediaList> = yield call<
      (url: string, config: AxiosRequestHeaders) => any
    >(
      axios.get,
      `/api/media/list?itemsPerPage=${params.itemsPerPage}` +
        `${params.pageNum ? '&pageNum=' + params.pageNum : ''}`,
      {
        headers: {
          'x-rair-token': params.xTok
        }
      }
    );

    if (videos !== undefined && videos.status === 200) {
      yield put(getVideoListComplete(videos.data.list));
      yield put(getVideoListTotal(videos.data.totalNumber));
    }
  } catch (error) {
    const errors = error as AxiosError;
    if (errors.response !== undefined) {
      if (errors.response.status === 404) {
        const errorDirec = 'This address does not exist';
        yield put(getListVideosError(errorDirec));
      } else if (errors.response.status === 500) {
        const errorServer = 'Sorry. an internal server problem has occurred';
        yield put(getListVideosError(errorServer));
      } else {
        yield put(getListVideosError(errors.response.data.message));
      }
    } else {
      const errorConex = 'Connection error!';
      yield put(getListVideosError(errorConex));
    }
  }
}

export function* sagaVideos() {
  yield takeLatest(types.GET_LIST_VIDEOS_START, getVideos);
}
