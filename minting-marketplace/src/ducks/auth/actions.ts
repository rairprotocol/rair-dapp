//@ts-nocheck
import * as types from './types';

const getProviderStart = () => ({ type: types.GET_PROVIDER_START } as const);

const getProviderComplete = (provider) => ({ type: types.GET_PROVIDER_COMPLETE, provider } as const);

const getProviderError = (error) => ({ type: types.GET_PROVIDER_ERROR, error } as const);

const getTokenStart = () => ({ type: types.GET_TOKEN_START } as const);

const getTokenComplete = (token) => ({ type: types.GET_TOKEN_COMPLETE, token } as const);

const getTokenError = (error) => ({ type: types.GET_TOKEN_ERROR, error } as const);

const getPublicAddressComplete = (publicAddress) => ({ type: types.GET_PUBLIC_ADDRESS_COMPLETE, publicAddress } as const);


export { getProviderStart, getProviderComplete, getProviderError, getTokenStart, getTokenComplete, getTokenError, getPublicAddressComplete };