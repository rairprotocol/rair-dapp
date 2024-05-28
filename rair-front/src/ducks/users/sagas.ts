import axios, { AxiosError, AxiosResponse } from 'axios';
import { constants, utils } from 'ethers';
import { call, put, takeLatest } from 'redux-saga/effects';

import { getUserComplete, getUserError } from './actions';
import * as types from './types';

import { TUserResponse } from '../../axios.responseTypes';

export type Params = { publicAddress: string; type: string };

export function* getUser({ publicAddress }: Params) {
  try {
    if (
      !utils.isAddress(publicAddress) ||
      publicAddress !== constants.AddressZero
    ) {
      return;
    }
    const response: AxiosResponse<TUserResponse> = yield call(
      axios.get,
      `/api/users/${publicAddress}`
    );

    if (response.data.user !== null && response.status === 200) {
      yield put(getUserComplete(response.data.user));
    }
  } catch (error) {
    const errors = error as AxiosError;
    if (errors.response !== undefined) {
      if (errors.response.status === 404) {
        const errorDirec = 'This address does not exist';
        yield put(getUserError(errorDirec));
      } else if (errors.response.status === 500) {
        const errorServer = 'Sorry. an internal server problem has occurred';
        yield put(getUserError(errorServer));
      } else {
        yield put(getUserError(errors.message));
      }
    } else {
      const errorConex = 'Connection error!';
      yield put(getUserError(errorConex));
    }
  }
}

export function* sagaUser() {
  yield takeLatest(types.GET_USER_START, getUser);
}
