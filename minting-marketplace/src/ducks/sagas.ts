import { all } from 'redux-saga/effects';

import { sagaAccess } from './auth/sagas';
import { sagaMetadata } from './metadata/sagas';
import { sagaNftData } from './nftData/saga';
import { sagaResales } from './resales/sagas';
import { sagaAllInformationFromSearch } from './search/sagas';
import { sagaUser } from './users/sagas';
import { sagaVideos } from './videos/sagas';

export default function* rootSaga() {
  yield all([
    sagaAccess(),
    sagaUser(),
    sagaVideos(),
    sagaAllInformationFromSearch(),
    sagaMetadata(),
    sagaNftData(),
    sagaResales()
  ]);
}
