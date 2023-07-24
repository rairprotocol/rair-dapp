import axios, { AxiosError, AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import {
  getListVideosError,
  getVideoListComplete,
  getVideoListTotal,
  setLoading
} from './actions';
import * as types from './types';
import { TUpdataVideoParams } from './videosDucks.types';

import { TMediaList } from '../../axios.responseTypes';

export type TParamsVideosSaga = {
  type: string;
  params: TUpdataVideoParams;
};

export function* getVideos({ params }: TParamsVideosSaga) {
  try {
    yield put(setLoading(true));
    const videos: AxiosResponse<TMediaList> = yield call(
      axios.get,
      `/api/media/list?itemsPerPage=${params.itemsPerPage}` +
        `${params.pageNum ? '&pageNum=' + params.pageNum : ''}` +
        `${params.blockchain ? '&blockchain=' + params.blockchain : ''}` +
        `${params.category ? params.category : ''}` +
        `${
          params.publicAddress ? '&userAddress=' + params.publicAddress : ''
        }` +
        `${params.mediaTitle ? '&mediaTitle=' + params.mediaTitle : ''}`
    );

    if (videos !== undefined && videos.status === 200) {
      yield put(getVideoListComplete(videos.data.list));
      yield put(getVideoListTotal(videos.data.totalNumber));
      yield put(setLoading(false));
    }
  } catch (error) {
    const errors = error as AxiosError;
    yield put(setLoading(false));

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
