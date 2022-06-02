//@ts-nocheck
import * as types from './types';

const InitialState = {
    error: null,
    provider: null,
    token: null,
    publicAddress: null
};

export default function accessStore(state = InitialState, action) {
    switch (action.type) {
        case types.GET_PROVIDER_START:
            return {
                ...state,
                provider: null
            }
        case types.GET_PROVIDER_COMPLETE:
            return {
                ...state,
                provider: action.provider
            }
        case types.GET_PROVIDER_ERROR:
            return {
                ...state,
                provider: action.error
            }
        case types.GET_TOKEN_START:
            return {
                ...state,
                token: null
            }
        case types.GET_TOKEN_COMPLETE:
            return {
                ...state,
                token: action.token
            }
        case types.GET_TOKEN_ERROR:
            return {
                ...state,
                token: action.error
            }
        case types.GET_PUBLIC_ADDRESS_COMPLETE:
            return {
                ...state,
                publicAddress: action.publicAddress
            }
        default:
            return state;
    }
}
