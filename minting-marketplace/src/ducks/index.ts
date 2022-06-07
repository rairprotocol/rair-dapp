import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
//REDUCERS
import accessStore from './auth';
import userStore from './users';
import videosStore from './videos';
import contractStore from './contracts';
import colorStore from './colors';
import metadataStore from './metadata';
import getPageStore from './pages';
import {createReduxEnhancer} from "@sentry/react";
import rootSaga from './sagas';
import allInformationFromSearch from './search/reducers'

const reducers = combineReducers({
    accessStore,
    userStore,
    videosStore,
    contractStore,
    colorStore,
    metadataStore,
    getPageStore,
    allInformationFromSearch
});

const sentryReduxEnhancer = createReduxEnhancer({
  // Optionally pass options listed below
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducers, undefined, compose(sentryReduxEnhancer, applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof reducers>;
export type AppDispatch = typeof store.dispatch;

export default store;
