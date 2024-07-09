import * as types from './types';

import { BlockchainSetting } from '../../components/adminViews/adminView.types';

const setCoingeckoRates = (rates: { [key: string]: number }) =>
  ({
    type: types.SET_COINGECKO_RATE,
    rates
  }) as const;

const setChainId = (
  currentChain: BlockchainType | undefined,
  blockchainSettings?: BlockchainSetting[]
) =>
  ({
    type: types.SET_CHAIN_ID,
    currentChain,
    blockchainSettings
  }) as const;

const setUserAddress = (currentUserAddress: string | undefined) =>
  ({ type: types.SET_USER_ADDRESS, currentUserAddress }) as const;

const setProgrammaticProvider = (programmaticProvider: any) =>
  ({
    type: types.SET_PROGRAMMATIC_PROVIDER,
    programmaticProvider
  }) as const;

const setRealChain = (realChain: BlockchainType | undefined) =>
  ({
    type: types.SET_REAL_CHAIN,
    realChain
  }) as const;

export {
  setChainId,
  setCoingeckoRates,
  setProgrammaticProvider,
  setRealChain,
  setUserAddress
};
