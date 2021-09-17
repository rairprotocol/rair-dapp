import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
//REDUCERS
import accessStore from './auth';
import userStore from './users';
import videosStore from './videos';
import contractStore from './contracts';

const reducers = combineReducers({
    accessStore,
    userStore,
    videosStore,
    contractStore
});

const sagaMiddleware = createSagaMiddleware();

const exp = () => {
    const store = createStore(reducers, undefined, compose(applyMiddleware(sagaMiddleware)));
    return { store, sagaMiddleware };
};

export default exp;