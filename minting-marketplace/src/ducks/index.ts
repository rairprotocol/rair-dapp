//@ts-nocheck
import { createReduxEnhancer } from '@sentry/react';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas';

import accessStore from './auth/reducers';
//REDUCERS
import colorStore from './colors/reducer';
import contractStore from './contracts/reducer';
import metadataStore from './metadata/reducers';
import nftDataStore from './nftData/reducers';
import getPageStore from './pages/reducers';
import allInformationFromSearch from './search/reducers';
import seoStore from './seo/reducers';
import userStore from './users/reducers';
import videosStore from './videos/reducers';

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
