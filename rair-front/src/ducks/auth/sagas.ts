import { providers } from 'ethers';
import { put, takeLatest } from 'redux-saga/effects';

import { getProviderComplete, getProviderError } from './actions';
import * as types from './types';

export function* getProvider() {
  try {
    const provider = new providers.Web3Provider(window.ethereum);
    yield put(getProviderComplete(provider));
  } catch (error: any) {
    if (error.response !== undefined) {
      if (error.response.status === 404) {
        const errorDirec = 'This address does not exist';
        yield put(getProviderError(errorDirec));
      } else if (error.response.status === 500) {
        const errorServer = 'Sorry. an internal server problem has occurred';
        yield put(getProviderError(errorServer));
      } else {
        yield put(getProviderError(error.response.data.message));
      }
    } else {
      const errorConex = 'Connection error!';
      yield put(getProviderError(errorConex));
    }
  }
}

export function* sagaAccess() {
  yield takeLatest(types.GET_PROVIDER_START, getProvider);
  // yield takeLatest(types.GET_TOKEN_START, getToken);
}
