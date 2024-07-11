import { ethers } from 'ethers';

import * as types from './types';

//unused-snippet
const getProviderStart = () => ({ type: types.GET_PROVIDER_START }) as const;

const getProviderComplete = (provider: ethers.providers.Web3Provider | null) =>
  ({ type: types.GET_PROVIDER_COMPLETE, provider }) as const;

const getProviderError = (error: string | null) =>
  ({ type: types.GET_PROVIDER_ERROR, error }) as const;

const getTokenStart = () => ({ type: types.GET_TOKEN_START }) as const;

const getTokenComplete = (token: string | null) =>
  ({ type: types.GET_TOKEN_COMPLETE, token }) as const;

const getTokenError = (error: boolean | null) =>
  ({ type: types.GET_TOKEN_ERROR, error }) as const;

//unused-snippet
const getPublicAddressComplete = (publicAddress: string | null) =>
  ({ type: types.GET_PUBLIC_ADDRESS_COMPLETE, publicAddress }) as const;

export {
  getProviderComplete,
  getProviderError,
  getProviderStart,
  getPublicAddressComplete,
  getTokenComplete,
  getTokenError,
  getTokenStart
};
