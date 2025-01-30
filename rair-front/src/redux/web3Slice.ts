import { createModularAccountAlchemyClient } from '@alchemy/aa-alchemy';
import { SmartContractAccount } from '@alchemy/aa-core';
import { AccountSigner } from '@alchemy/aa-ethers';
import { Web3AuthSigner } from '@alchemy/aa-signers/web3auth';
import { Maybe } from '@metamask/providers/dist/utils';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BrowserProvider } from 'ethers';
import { Hex } from 'viem';

import { dataStatuses } from './commonTypes';

import { CombinedBlockchainData } from '../types/commonTypes';
import { metamaskEventListeners } from '../utils/metamaskUtils';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { getWalletProvider, WalletType } from '../utils/ethereumProviders';

interface ChainData {
  connectedChain?: Hex;
  currentUserAddress?: Hex;
  provider?: MetaMaskInpageProvider;
}
export interface ContractsState extends ChainData {
  web3Status: dataStatuses;
  connectedChain?: Hex;
  currentUserAddress?: Hex;
  programmaticProvider?: AccountSigner<SmartContractAccount>;
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

export const connectChainWeb3Auth = createAsyncThunk(
  'web3/connectChainWeb3Auth',
  async (chainData: CombinedBlockchainData) => {
    const web3AuthSigner = new Web3AuthSigner({
      clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
      chainConfig: {
        chainNamespace: 'eip155',
        chainId: chainData.chainId,
        rpcTarget: chainData.rpcEndpoint,
        displayName: chainData.name,
        blockExplorer: chainData.blockExplorerGateway,
        ticker: chainData.symbol,
        tickerName: chainData.name
      },
      web3AuthNetwork: chainData.testnet
        ? 'sapphire_devnet'
        : 'sapphire_mainnet'
    });
    await web3AuthSigner.authenticate({
      init: async () => {
        await web3AuthSigner.inner.initModal();
      },
      connect: async () => {
        await web3AuthSigner.inner.connect();
      }
    });

    const modularAccount = await createModularAccountAlchemyClient({
      apiKey: chainData.alchemyAppKey,
      chain: chainData.viem!,
      signer: web3AuthSigner,
      gasManagerConfig: chainData.alchemyGasPolicy
        ? {
            policyId: chainData.alchemyGasPolicy
          }
        : undefined
    });
    return {
      connectedChain: chainData.hash,
      currentUserAddress: modularAccount.account.address,
      userDetails: await web3AuthSigner.getAuthDetails()
    };
  }
);

export const connectChainBrowserWallet = createAsyncThunk(
  'web3/connectChainBrowserWallet',
  async (walletType: WalletType) => {
    const ethereum = await getWalletProvider(walletType);
    if (!ethereum) {
      return {
        signer: undefined,
        currentUserAddress: undefined,
        connectedChain: undefined
      };
    }
    const provider = new BrowserProvider(ethereum);
    metamaskEventListeners(provider);
    const accounts: Maybe<Hex[]> = await ethereum.request({
      method: 'eth_requestAccounts'
    });
    const connectedChain: Maybe<Hex> =
      (await ethereum.request({
        method: 'eth_chainId'
      })) || undefined;
    const currentUserAddress = accounts?.at(0);
    return {
      currentUserAddress,
      connectedChain: connectedChain as Hex,
      provider: ethereum
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
      state.currentUserAddress = action.payload.toLowerCase() as Hex;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(connectChainBrowserWallet.pending, (state) => {
        state.web3Status = dataStatuses.Loading;
      })
      .addCase(connectChainBrowserWallet.fulfilled, (state, action) => {
        state.web3Status = dataStatuses.Complete;
        if (action.payload.connectedChain) {
          state.connectedChain = action.payload.connectedChain;
        }
        if (action.payload.currentUserAddress) {
          state.currentUserAddress =
            action.payload.currentUserAddress.toLowerCase() as Hex;
        }
        if (action.payload.provider) {
          state.provider = action.payload.provider;
        }
      })
      .addCase(connectChainBrowserWallet.rejected, (state) => {
        state.web3Status = dataStatuses.Failed;
      })
      .addCase(connectChainWeb3Auth.pending, (state) => {
        state.web3Status = dataStatuses.Loading;
      })
      .addCase(connectChainWeb3Auth.fulfilled, (state, action) => {
        state.web3Status = dataStatuses.Complete;
        if (action.payload.connectedChain) {
          state.connectedChain = action.payload.connectedChain;
        }
        if (action.payload.currentUserAddress) {
          state.currentUserAddress =
            action.payload.currentUserAddress.toLowerCase() as Hex;
        }
      })
      .addCase(connectChainWeb3Auth.rejected, (state) => {
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
