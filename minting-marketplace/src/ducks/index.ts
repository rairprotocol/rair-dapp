//@ts-nocheck
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
//REDUCERS

import colorStore from './colors/reducer';
import getPageStore from './pages/reducers';
import userStore from './users/reducers';
import accessStore from './auth/reducers';
import videosStore from './videos/reducers';
import contractStore from './contracts/reducer';
import metadataStore from './metadata/reducers';
import { createReduxEnhancer } from '@sentry/react';
import rootSaga from './sagas';
import allInformationFromSearch from './search/reducers';
import nftDataStore from './nftData/reducers';
import seoStore from './seo/reducers';

const reducers = combineReducers({
  accessStore,
  userStore,
  videosStore,
  contractStore,
  colorStore,
  metadataStore,
  getPageStore,
  allInformationFromSearch,
  nftDataStore,
  seoStore
});

const sentryReduxEnhancer = createReduxEnhancer({
  // Optionally pass options listed below
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducers,
  undefined,
  compose(sentryReduxEnhancer, applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;

export default store;
