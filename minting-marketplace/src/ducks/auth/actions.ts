//@ts-nocheck
import * as types from './types';

const getToken = (payload) => ({
    type: types.GET_TOKEN_START,
    payload: { payload },
});

const getProvider = () => ({
    type: types.GET_PROVIDER_START
})

export { getToken, getProvider }