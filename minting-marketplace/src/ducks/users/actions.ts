//@ts-nocheck
import * as types from './types';

const getUser = (publicAddress) => ({
    type: types.GET_USER_START,
    payload: { publicAddress },
});

export { getUser }