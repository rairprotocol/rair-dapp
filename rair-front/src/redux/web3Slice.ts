//@ts-nocheck
import {
  alchemy,
  AlchemySmartAccountClient,
  createAlchemySmartAccountClient
} from '@account-kit/infra';
import { AlchemyWebSigner } from '@account-kit/signer';
import { createLightAccount } from '@account-kit/smart-contracts';
import { createModularAccountAlchemyClient } from '@alchemy/aa-alchemy';
import { Web3AuthSigner } from '@alchemy/aa-signers/web3auth';
import { Maybe } from '@metamask/providers/dist/utils';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base';
import { BrowserProvider } from 'ethers';
import { Hex } from 'viem';

import { dataStatuses } from './commonTypes';

import { CombinedBlockchainData } from '../types/commonTypes';
import { metamaskEventListeners } from '../utils/metamaskUtils';

interface ChainData {
  connectedChain?: Hex;
  currentUserAddress?: Hex;
}
export interface ContractsState extends ChainData {
  web3Status: dataStatuses;
  connectedChain?: Hex;
  currentUserAddress?: Hex;
  programmaticProvider?: AlchemySmartAccountClient;
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

export const connectChainAlchemyV4 = createAsyncThunk(
  'web3/connectChainAlchemyV4',
  async (chainData: CombinedBlockchainData) => {
    if (!chainData.alchemyAppKey || !chainData.viem) {
      return {};
    }
    const signer = new AlchemyWebSigner({
      client: {
        connection: {
          // rpcUrl: chainData.viem.blockExplorers.alchemy.http[0],
          apiKey: chainData.alchemyAppKey
          // chain: chainInformation.viem,
          // policyId: chainInformation.alchemyGasPolicy
        },
        iframeConfig: {
          iframeContainerId: 'rair-asif' // Alchemy signer iFrame
        }
      }
    });

    if (!signer) {
      return {};
    }

    const alchemyTransport = alchemy({
      apiKey: chainData.alchemyAppKey
    });

    await signer.preparePopupOauth();

    const data = await signer.authenticate({
      type: 'oauth',
      authProviderId: 'auth0',
      auth0Connection: 'github',
      mode: 'popup'
    });

    const client = createAlchemySmartAccountClient({
      transport: alchemyTransport,
      policyId: chainData.alchemyGasPolicy,
      chain: chainData.viem,
      account: await createLightAccount({
        chain: chainData.viem,
        transport: alchemyTransport,
        signer
      })
    });

    return {
      connectedChain: chainData.hash,
      currentUserAddress: data.address,
      userDetails: signer,
      client
    };
  }
);

export const connectChainWeb3Auth = createAsyncThunk(
  'web3/connectChainWeb3Auth',
  async (chainData: CombinedBlockchainData) => {
    if (!chainData.viem) {
      return {};
    }
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
        ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
        : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
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
      chain: chainData.viem,
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
    const accounts: Maybe<Hex[]> = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    const connectedChain: Maybe<Hex> =
      (await window.ethereum.request({
        method: 'eth_chainId'
      })) || undefined;
    const currentUserAddress = accounts?.at(0);
    return {
      currentUserAddress,
      connectedChain: connectedChain as Hex
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
      .addCase(connectChainMetamask.pending, (state) => {
        state.web3Status = dataStatuses.Loading;
      })
      .addCase(connectChainMetamask.fulfilled, (state, action) => {
        state.web3Status = dataStatuses.Complete;
        if (action.payload.connectedChain) {
          state.connectedChain = action.payload.connectedChain;
        }
        if (action.payload.currentUserAddress) {
          state.currentUserAddress =
            action.payload.currentUserAddress.toLowerCase() as Hex;
        }
      })
      .addCase(connectChainMetamask.rejected, (state) => {
        state.web3Status = dataStatuses.Failed;
      })
      .addCase(connectChainWeb3Auth.pending, (state) => {
        state.web3Status = dataStatuses.Loading;
      })
      .addCase(connectChainWeb3Auth.fulfilled, (state, action) => {
        state.web3Status = dataStatuses.Complete;
        if (action.payload?.connectedChain) {
          state.connectedChain = action.payload.connectedChain;
        }
        if (action.payload.currentUserAddress) {
          state.currentUserAddress =
            action.payload.currentUserAddress.toLowerCase() as Hex;
        }
      })
      .addCase(connectChainWeb3Auth.rejected, (state) => {
        state.web3Status = dataStatuses.Failed;
      })
      .addCase(connectChainAlchemyV4.pending, (state) => {
        state.web3Status = dataStatuses.Loading;
      })
      .addCase(connectChainAlchemyV4.fulfilled, (state, action) => {
        state.web3Status = dataStatuses.Complete;
        if (action.payload.connectedChain) {
          state.connectedChain = action.payload.connectedChain;
        }
        if (action.payload.currentUserAddress) {
          state.currentUserAddress =
            action.payload.currentUserAddress.toLowerCase() as Hex;
        }
        if (action.payload.userDetails) {
          state.programmaticProvider = action.payload.client;
        }
      })
      .addCase(connectChainAlchemyV4.rejected, (state) => {
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
