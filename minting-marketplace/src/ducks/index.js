import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
//REDUCERS
import accessStore from './auth';
import userStore from './users';
import videosStore from './videos';
import contractStore from './contracts';
import colorStore from './colors';
import metadataStore from './metadata';
import {createReduxEnhancer} from "@sentry/react";

const reducers = combineReducers({
    accessStore,
    userStore,
    videosStore,
    contractStore,
    colorStore,
    metadataStore
});

const sentryReduxEnhancer = createReduxEnhancer({
  // Optionally pass options listed below
});

const sagaMiddleware = createSagaMiddleware();

const exp = () => {
    const store = createStore(reducers, undefined, compose(sentryReduxEnhancer, applyMiddleware(sagaMiddleware)));
    return { store, sagaMiddleware };
};

export default exp;