//@ts-nocheck
import { all } from "redux-saga/effects";
import { sagaAccess } from "./auth/sagas";
import { sagaUser } from "./users/sagas";
import { sagaVideos } from "./videos/sagas";

export default function* rootSaga() {
  yield all([
    sagaAccess(),
    sagaUser(),
    sagaVideos()
  ]);
}
