//@ts-nocheck
import axios from "axios";
import { put, call, takeLatest } from "redux-saga/effects";
import * as types from "./types";

export function* getAllInformationFromSearch(titleSearchDemo) {
  try {
    let searchData: Object;

    if (titleSearchDemo.payload) {
      const titleSearchDemoEncoded = encodeURIComponent(
        titleSearchDemo.payload
      );

      searchData = yield call(() => {
        return axios.get(`/api/search/${titleSearchDemoEncoded}`);
      });
    //   if (searchData.data.data) {
      if (searchData !== undefined && searchData.status === 200) {
        if (searchData.data.data) {
            yield put({
                type: types.GET_DATA_ALL_COMPLETE,
                payload: searchData.data.data,
              });
        }
      else if(!searchData.data.data){
        yield put({
            type: types.GET_DATA_ALL_EMPTY,
          });
      }
      }
    }
  } catch (error) {
    console.log(error, "error from sagas");

    if (error.response !== undefined) {
        if (error.response.status === 404) {
            const errorDirec = "Nothing can found";
            yield put({
                type: types.GET_DATA_ALL_EMPTY,
                message: errorDirec,
            });
        } else if (error.response.status === 500) {
            const errorServer =
                "Sorry. an internal server problem has occurred";
            yield put({
                type: types.GET_DATA_ALL_EMPTY,
                message: errorServer,
            });
        } else {
            yield put({
                type: types.GET_DATA_ALL_EMPTY,
                error: error.response.data.message,
            });
        }
    } else {
        const errorConnection = "Nothing can fiend error!";
        yield put({ type: types.GET_DATA_ALL_EMPTY, error: errorConnection });
    }
  }
}

export function* sagaAllInformationFromSearch() {
  yield takeLatest(types.GET_DATA_ALL_START, getAllInformationFromSearch);
}
