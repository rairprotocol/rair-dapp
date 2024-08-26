import { useState } from 'react';
import { JsonRpcProvider, Wallet } from 'ethers';

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import {
  setConnectedChain,
  setProgrammaticProvider
} from '../../redux/web3Slice';
import InputField from '../common/InputField';

const BlockChainSwitcher = () => {
  const [UNSAFE_PrivateKey, setUNSAFE_PrivateKey] = useState('');
  const { textColor, primaryButtonColor, secondaryButtonColor } =
    useAppSelector((store) => store.colors);
  const { blockchainSettings } = useAppSelector((store) => store.settings);
  const { web3Switch } = useWeb3Tx();

  const { connectedChain } = useAppSelector((state) => state.web3);
  const dispatch = useAppDispatch();
  const reactSwal = useSwal();

  const connectProgrammatically = async ({
    rpcEndpoint,
    chainId,
    chainName,
    symbol
  }) => {
    try {
      const networkData = {
        chainId: Number(chainId),
        symbol: symbol,
        name: chainName,
        timeout: 1000000
      };
      const provider = new JsonRpcProvider(rpcEndpoint, networkData);
      const currentWallet = new Wallet(UNSAFE_PrivateKey, provider);
      dispatch(setProgrammaticProvider(currentWallet));
      dispatch(setConnectedChain(chainId));
    } catch (err) {
      const error = err as Error;
      console.error(error);
      reactSwal.fire('Error', error.message, 'error');
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
              {blockchainSettings.map((item, index) => {
                if (!item.rpcEndpoint) {
                  return <div className="d-none" key={index}></div>;
                }
                return (
                  <button
                    key={index}
                    id={`connect_${item.symbol}`}
                    className="btn rair-button mt-5"
                    style={{
                      background:
                        index % 2 === 0
                          ? secondaryButtonColor
                          : primaryButtonColor,
                      color: textColor
                    }}
                    disabled={
                      connectedChain === item.hash?.toLowerCase() ||
                      UNSAFE_PrivateKey.length !== 64
                    }
                    onClick={async () => {
                      await connectProgrammatically({
                        rpcEndpoint: item.rpcEndpoint,
                        chainId: item.hash,
                        chainName: item.name,
                        symbol: item.symbol
                      });
                    }}>
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
          <hr className="w-100" />
        </div>
      )}
      {blockchainSettings.map((item, index) => {
        return (
          <button
            key={index}
            className="btn rair-button mt-5"
            style={{
              background:
                index % 2 === 0 ? secondaryButtonColor : primaryButtonColor,
              color: textColor
            }}
            disabled={connectedChain === item.hash?.toLowerCase()}
            onClick={() => {
              if (item.hash) {
                web3Switch(item.hash);
              }
            }}>
            {item.name} ({item.hash})
          </button>
        );
      })}
      <hr />
    </div>
  );
};

export default BlockChainSwitcher;
