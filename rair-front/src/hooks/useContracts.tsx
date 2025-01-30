//@ts-nocheck
/* eslint-disable no-case-declarations */
import { useCallback, useEffect, useState } from 'react';
import { createModularAccountAlchemyClient } from '@alchemy/aa-alchemy';
import { SmartContractAccount } from '@alchemy/aa-core';
import { AccountSigner, EthersProviderAdapter } from '@alchemy/aa-ethers';
import { Web3AuthSigner } from '@alchemy/aa-signers/web3auth';
import { Alchemy } from 'alchemy-sdk';
import { BrowserProvider, Contract, isAddress, JsonRpcSigner } from 'ethers';
import { Hex } from 'viem';

import { useAppSelector } from './useReduxHooks';
import useServerSettings from './useServerSettings';

import {
  ContractABI,
  diamondFactoryAbi,
  diamondMarketplaceAbi,
  erc777Abi,
  factoryAbi,
  licenseExchangeABI
} from '../contracts';

const useContracts = () => {
  const { getBlockchainData } = useServerSettings();
  const { loginType, isLoggedIn } = useAppSelector((store) => store.user);
  const { connectedChain, provider } = useAppSelector((store) => store.web3);

  const [signer, setSigner] = useState<
    JsonRpcSigner | AccountSigner<SmartContractAccount>
  >();
  const [diamondFactoryInstance, setDiamondFactoryInstance] = useState<
    Contract | undefined
  >();
  const [diamondMarketplaceInstance, setDiamondMarketplaceInstance] = useState<
    Contract | undefined
  >();
  const [mainTokenInstance, setMainTokenInstance] = useState<
    Contract | undefined
  >();
  const [classicFactoryInstance, setClassicFactoryInstance] = useState<
    Contract | undefined
  >();
  const [licenseExchangeInstance, setLicenseExchangeInstance] = useState<
    Contract | undefined
  >();

  const createWeb3AuthSigner = useCallback(async () => {
    const chainData = getBlockchainData(connectedChain);

    if (!chainData) {
      return;
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

    const alchemy = new Alchemy({
      apiKey: chainData.alchemyAppKey,
      network: chainData?.alchemy,
      maxRetries: 10
    });

    const ethersProvider = await alchemy.config.getProvider();
    const provider =
      EthersProviderAdapter.fromEthersProvider(ethersProvider).connectToAccount(
        modularAccount
      );

    return provider;
  }, [connectedChain, getBlockchainData]);

  const refreshSigner = useCallback(async () => {
    const ethereum = provider
    if (!isLoggedIn) {
      return;
    }
    switch (loginType) {
      case 'metamask':
        if (!ethereum.isConnected()) {
          return;
        }
        const metamaskProvider = new BrowserProvider(ethereum);
        const signer = await metamaskProvider.getSigner(0);
        setSigner(signer);
        break;
      case 'web3auth':
        setSigner(await createWeb3AuthSigner());
        break;
    }
  }, [loginType, isLoggedIn, createWeb3AuthSigner]);

  useEffect(() => {
    refreshSigner();
  }, [refreshSigner, connectedChain]);

  const contractCreator = useCallback(
    (address: Hex | undefined, abi: ContractABI) => {
      if (isLoggedIn && !signer) {
        refreshSigner();
        return;
      }
      if (address && isAddress(address) && signer) {
        return new Contract(address, abi, signer);
      }
    },
    [isLoggedIn, refreshSigner, signer]
  );

  useEffect(() => {
    if (!signer) {
      return;
    }
    const chainData = getBlockchainData(connectedChain);
    if (
      chainData?.diamondFactoryAddress &&
      isAddress(chainData?.diamondFactoryAddress)
    ) {
      setDiamondFactoryInstance(
        new Contract(
          chainData?.diamondFactoryAddress,
          diamondFactoryAbi,
          signer
        )
      );
    } else {
      setDiamondFactoryInstance(undefined);
    }

    if (
      chainData?.diamondMarketplaceAddress &&
      isAddress(chainData?.diamondMarketplaceAddress)
    ) {
      setDiamondMarketplaceInstance(
        new Contract(
          chainData?.diamondMarketplaceAddress,
          diamondMarketplaceAbi,
          signer
        )
      );
    } else {
      setDiamondMarketplaceInstance(undefined);
    }

    if (chainData?.mainTokenAddress && isAddress(chainData?.mainTokenAddress)) {
      setMainTokenInstance(
        new Contract(chainData?.mainTokenAddress, erc777Abi, signer)
      );
    } else {
      setMainTokenInstance(undefined);
    }
    if (
      chainData?.classicFactoryAddress &&
      isAddress(chainData?.classicFactoryAddress)
    ) {
      setClassicFactoryInstance(
        new Contract(chainData?.classicFactoryAddress, factoryAbi, signer)
      );
    } else {
      setClassicFactoryInstance(undefined);
    }
    if (
      chainData?.licenseExchangeAddress &&
      isAddress(chainData?.licenseExchangeAddress)
    ) {
      setLicenseExchangeInstance(
        new Contract(
          chainData?.licenseExchangeAddress,
          licenseExchangeABI,
          signer
        )
      );
    } else {
      setLicenseExchangeInstance(undefined);
    }
  }, [getBlockchainData, connectedChain, signer]);

  return {
    diamondFactoryInstance,
    diamondMarketplaceInstance,
    mainTokenInstance,
    classicFactoryInstance,
    licenseExchangeInstance,
    contractCreator,
    refreshSigner
  };
};

export default useContracts;
