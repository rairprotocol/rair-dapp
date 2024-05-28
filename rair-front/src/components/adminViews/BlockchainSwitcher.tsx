import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ethers from 'ethers';
import Swal from 'sweetalert2';

import {
  BlockchainInfo,
  ChainDataType,
  MetamaskError
} from './adminView.types';

import { RootState } from '../../ducks';
import {
  setChainId,
  setProgrammaticProvider
} from '../../ducks/contracts/actions';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import chainData from '../../utils/blockchainData';
import InputField from '../common/InputField';

const bootstrapColorMapping = {
  '0x1': 'light',
  '0xaa36a7': 'light',
  '0x250': 'primary',
  '0x89': 'warning',
  '0x13881': 'warning',
  '0x2105': 'light'
};

const blockchains: BlockchainInfo[] = Object.keys(chainData)
  .filter((chain) => chainData[chain].disabled !== true)
  .map((chain) => {
    return {
      chainData: chainData[chain].addChainData,
      bootstrapColor: bootstrapColorMapping[chain]
    };
  });

const BlockChainSwitcher = () => {
  const [UNSAFE_PrivateKey, setUNSAFE_PrivateKey] = useState('');

  const { currentChain } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );
  const dispatch = useDispatch();

  const connectProgrammatically = async ({
    rpcUrls,
    chainId,
    chainName,
    nativeCurrency
  }: ChainDataType) => {
    try {
      const networkData = {
        chainId: Number(chainId),
        symbol: nativeCurrency?.symbol,
        name: chainName,
        timeout: 1000000
      };
      const provider = new ethers.providers.JsonRpcProvider(
        rpcUrls?.[0],
        networkData
      );
      const currentWallet = await new ethers.Wallet(
        UNSAFE_PrivateKey,
        provider
      );
      await dispatch(setProgrammaticProvider(currentWallet));
      dispatch(setChainId(chainId));
    } catch (err) {
      const error = err as Error;
      console.error(error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  const switchEthereumChain = async (chainData: ChainDataType) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainData.chainId }]
      });
    } catch (switchError) {
      const metamaskError = switchError as MetamaskError;
      // This error code indicates that the chain has not been added to MetaMask.
      if (metamaskError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainData]
          });
        } catch (addError) {
          console.error(addError);
        }
      } else {
        console.error(switchError);
      }
    }
  };

  return (
    <div className="col-12">
      {!window.ethereum && (
        <div className="row w-100 px-0 mx-0">
          <div className="col-12 px-5">
            <InputField
              customClass="form-control"
              type="password"
              placeholder="For testing purposes ONLY"
              getter={UNSAFE_PrivateKey}
              setter={setUNSAFE_PrivateKey}
            />
          </div>
          <div className="col-12">
            <div className="col-12">
              {blockchains.map((item, index) => {
                if (!item.chainData.rpcUrls) {
                  return <div className="d-none" key={index}></div>;
                }
                return (
                  <button
                    key={index}
                    id={`connect_${item.chainData.nativeCurrency?.symbol}`}
                    className={`btn btn-${item.bootstrapColor}`}
                    disabled={
                      currentChain === item.chainData.chainId?.toLowerCase() ||
                      UNSAFE_PrivateKey.length !== 64
                    }
                    onClick={async () => {
                      await connectProgrammatically(item.chainData);
                    }}>
                    {item.chainData.chainName}
                  </button>
                );
              })}
            </div>
          </div>
          <hr className="w-100" />
        </div>
      )}
      {window.ethereum &&
        blockchains.map((item, index) => {
          return (
            <button
              key={index}
              className={`btn btn-${item.bootstrapColor} mt-5`}
              disabled={currentChain === item.chainData.chainId?.toLowerCase()}
              onClick={async () => {
                await switchEthereumChain(item.chainData);
                dispatch(setChainId(undefined));
              }}>
              {item.chainData.chainName}
            </button>
          );
        })}
      <hr />
    </div>
  );
};

export default BlockChainSwitcher;
