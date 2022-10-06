import * as ethers from 'ethers';
import { put, takeLatest } from 'redux-saga/effects';

import { getProviderComplete, getProviderError } from './actions';
import * as types from './types';

export function* getProvider() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
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

// export function* getToken({ payload }) {
//     const { publicAddress, signature, isAdmin} = payload
//     try {
//         fetch('/api/auth/authentication', {
//             method: 'POST',
//             body: JSON.stringify({ publicAddress, signature, adminRights: isAdmin }),
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(blob => blob.json())
//         .then(res => console.log(res))
//     } catch (error) {
//         if (error.response !== undefined) {
//             if (error.response.status === 404) {
//                 const errorDirec = "This address does not exist";
//                 yield put({
//                     type: types.GET_TOKEN_ERROR,
//                     error: errorDirec,
//                 });
//             } else if (error.response.status === 500) {
//                 const errorServer =
//                     "Sorry. an internal server problem has occurred";
//                 yield put({
//                     type: types.GET_TOKEN_ERROR,
//                     error: errorServer,
//                 });
//             } else {
//                 yield put({
//                     type: types.GET_TOKEN_ERROR,
//                     error: error.response.data.message,
//                 });
//             }
//         } else {
//             const errorConex = "Connection error!";
//             yield put({ type: types.GET_TOKEN_ERROR, error: errorConex });
//         }
//     }
// }

export function* sagaAccess() {
  yield takeLatest(types.GET_PROVIDER_START, getProvider);
  // yield takeLatest(types.GET_TOKEN_START, getToken);
}
