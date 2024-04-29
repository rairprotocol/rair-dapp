import { ethers } from 'ethers';

import {
  getProviderComplete,
  getProviderError,
  getProviderStart,
  getPublicAddressComplete,
  getTokenComplete,
  getTokenError,
  getTokenStart
} from './actions';

export type TAuthInitialState = {
  error: string | boolean | null;
  provider: ethers.providers.Web3Provider | null;
  token: string | null;
  publicAddress: string | null;
};

export type TGetProviderStart = ReturnType<typeof getProviderStart>;
export type TGetProviderComplete = ReturnType<typeof getProviderComplete>;
export type TGetProviderError = ReturnType<typeof getProviderError>;
export type TGetTokenStart = ReturnType<typeof getTokenStart>;
export type TGetTokenComplete = ReturnType<typeof getTokenComplete>;
export type TGetTokenError = ReturnType<typeof getTokenError>;
export type TGetPublicAddressComplete = ReturnType<
  typeof getPublicAddressComplete
>;

export type TAuthActionsType =
  | TGetProviderStart
  | TGetProviderComplete
  | TGetProviderError
  | TGetTokenStart
  | TGetTokenComplete
  | TGetTokenError
  | TGetPublicAddressComplete;
