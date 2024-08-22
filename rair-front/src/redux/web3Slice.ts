import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BrowserProvider, Provider } from 'ethers';
import { Hex } from 'viem';

import { dataStatuses } from './commonTypes';

import { metamaskEventListeners } from '../utils/metamaskUtils';

interface ChainData {
  connectedChain?: Hex;
  currentUserAddress?: Hex;
}
export interface ContractsState extends ChainData {
  web3Status: dataStatuses;
  connectedChain?: Hex;
  currentUserAddress?: Hex;
  programmaticProvider?: Provider;
  requestedChain?: Hex;
  exchangeRates?: any;
}

const defaultChain: Hex = import.meta.env.VITE_DEFAULT_BLOCKCHAIN;

const initialState: ContractsState = {
  web3Status: dataStatuses.Uninitialized,
  connectedChain: defaultChain,
  currentUserAddress: undefined,
  programmaticProvider: undefined,
  requestedChain: undefined,
  exchangeRates: undefined
};

export const connectChainMetamask = createAsyncThunk(
  'web3/connectChainMetamask',
  async () => {
    if (!window.ethereum) {
      return {
        signer: undefined,
        currentUserAddress: undefined,
        connectedChain: undefined
      };
    }
    const provider = new BrowserProvider(window.ethereum);
    metamaskEventListeners(provider);
    const accounts = await window.ethereum.request<Array<Hex>>({
      method: 'eth_requestAccounts'
    });
    const connectedChain =
      (await window.ethereum.request<Hex>({
        method: 'eth_chainId'
      })) || undefined;
    const currentUserAddress = accounts?.at(0);
    return {
      currentUserAddress,
      connectedChain
    };
  }
);

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setExchangeRates: (state, action) => {
      state.exchangeRates = action.payload;
    },
    setRequestedChain: (state, action: PayloadAction<Hex>) => {
      state.requestedChain = action.payload;
    },
    setConnectedChain: (state, action: PayloadAction<Hex | undefined>) => {
      state.connectedChain = action.payload;
    },
    setProgrammaticProvider: (state, action) => {
      state.programmaticProvider = action.payload;
    },
    setUserAddress: (state, action: PayloadAction<Hex>) => {
      state.currentUserAddress = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectChainMetamask.pending, (state) => {
        state.web3Status = dataStatuses.Loading;
      })
      .addCase(connectChainMetamask.fulfilled, (state, action) => {
        return {
          ...state,
          web3Status: dataStatuses.Complete,
          ...action.payload
        };
      })
      .addCase(connectChainMetamask.rejected, (state) => {
        state.web3Status = dataStatuses.Failed;
      });
  }
});

export const {
  setExchangeRates,
  setRequestedChain,
  setConnectedChain,
  setProgrammaticProvider,
  setUserAddress
} = web3Slice.actions;
export default web3Slice.reducer;
