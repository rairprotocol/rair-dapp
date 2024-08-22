/* eslint-disable no-case-declarations */
import { useCallback, useEffect, useState } from 'react';
import { BrowserProvider, Contract, isAddress, JsonRpcSigner } from 'ethers';
import { Hex } from 'viem';

import { useAppSelector } from './useReduxHooks';

import {
  ContractABI,
  diamondFactoryAbi,
  diamondMarketplaceAbi,
  erc777Abi,
  factoryAbi,
  licenseExchangeABI
} from '../contracts';

const useContracts = () => {
  const { blockchainSettings } = useAppSelector((store) => store.settings);
  const { loginType, isLoggedIn } = useAppSelector((store) => store.user);
  const { connectedChain } = useAppSelector((store) => store.web3);

  const [signer, setSigner] = useState<JsonRpcSigner>();
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

  const refreshSigner = useCallback(async () => {
    if (!isLoggedIn) {
      return;
    }
    switch (loginType) {
      case 'metamask':
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(0);
        setSigner(signer);
        break;
    }
  }, [loginType, isLoggedIn]);

  useEffect(() => {
    refreshSigner();
  }, [refreshSigner]);

  const contractCreator = useCallback(
    (address: Hex | undefined, abi: ContractABI) => {
      if (address && isAddress(address) && signer) {
        return new Contract(address, abi, signer);
      }
    },
    [signer]
  );

  useEffect(() => {
    if (!signer) {
      return;
    }
    const chainData = blockchainSettings.find(
      (chain) => chain.hash === connectedChain
    );
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
    }
    if (chainData?.mainTokenAddress && isAddress(chainData?.mainTokenAddress)) {
      setMainTokenInstance(
        new Contract(chainData?.mainTokenAddress, erc777Abi, signer)
      );
    }
    if (
      chainData?.classicFactoryAddress &&
      isAddress(chainData?.classicFactoryAddress)
    ) {
      setClassicFactoryInstance(
        new Contract(chainData?.classicFactoryAddress, factoryAbi, signer)
      );
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
    }
  }, [blockchainSettings, connectedChain, signer]);

  return {
    diamondFactoryInstance,
    diamondMarketplaceInstance,
    mainTokenInstance,
    classicFactoryInstance,
    licenseExchangeInstance,
    contractCreator
  };
};

export default useContracts;
