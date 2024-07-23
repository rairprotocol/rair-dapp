import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, utils } from 'ethers';
import { stringToHex } from 'viem';

import { IFactoryManager } from './creatorMode.types';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';

const FactoryManager: React.FC<IFactoryManager> = ({ setDeployedTokens }) => {
  const [erc721Name, setERC721Name] = useState<string>('');
  const [clientTokens, setClientTokens] = useState<BigNumber>();
  const [tokensOwned, setTokensOwned] = useState<BigNumber>();
  const [tokensRequired, setTokensRequired] = useState<BigNumber>();
  const [tokenSymbol, setTokenSymbol] = useState<string>();
  const [tokenDecimals, setTokenDecimals] = useState<number | undefined>();
  const [refetchingFlag, setRefetchingFlag] = useState<boolean>(false);

  const { erc777Instance, factoryInstance, currentUserAddress } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);
  const { textColor, secondaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const refreshData = useCallback(async () => {
    setRefetchingFlag(true);
    const tokenCount =
      await factoryInstance?.getContractCountOf(currentUserAddress);
    const tokens: string[] = [];
    for (let i = 0; i < tokenCount; i++) {
      tokens.push(
        await factoryInstance?.ownerToContracts(currentUserAddress, i)
      );
    }
    setClientTokens(await erc777Instance?.balanceOf(currentUserAddress));
    setTokensOwned(tokenCount);
    setDeployedTokens(tokens);
    setTokensRequired(
      await factoryInstance?.deploymentCostForERC777(erc777Instance?.address)
    );
    setRefetchingFlag(false);
    setTokenSymbol(await erc777Instance?.symbol());
    setTokenDecimals(await erc777Instance?.decimals());
  }, [currentUserAddress, factoryInstance, erc777Instance, setDeployedTokens]);

  useEffect(() => {
    if (currentUserAddress) {
      refreshData();
    }
  }, [factoryInstance, refreshData, currentUserAddress]);
  return (
    <div
      className="col py-4 border border-white rounded"
      style={{ position: 'relative' }}>
      <h5>Factory</h5>
      <small>({factoryInstance?.address})</small>
      <br />
      <button
        style={{ position: 'absolute', left: 0, top: 0, color: 'inherit' }}
        onClick={refreshData}
        disabled={refetchingFlag}
        className="btn">
        {refetchingFlag ? '...' : <FontAwesomeIcon icon={faRedo} />}
      </button>
      <br />
      {tokensOwned && tokensRequired && tokenDecimals ? (
        <>
          You currently own {tokensOwned._hex.length} ERC721 contracts
          <br />
          <h5>Deploy a new contract</h5>
          {"New contract's name:"}
          <input
            className="form-control w-75 mx-auto"
            value={erc721Name}
            onChange={(e) => setERC721Name(e.target.value)}
          />
          <br />
          <button
            disabled={erc721Name === '' || clientTokens?.lt(tokensRequired)}
            onClick={async () => {
              if (!erc777Instance) {
                return;
              }
              reactSwal.fire({
                title: 'Deploying contract',
                html: 'Please wait',
                icon: 'info',
                showConfirmButton: false
              });
              if (
                await web3TxHandler(erc777Instance, 'send', [
                  factoryInstance?.address,
                  tokensRequired,
                  stringToHex(erc721Name)
                ])
              ) {
                reactSwal.fire({
                  title: 'Success',
                  html: 'Contract Deployed',
                  icon: 'success'
                });
              }
            }}
            style={{
              background: secondaryButtonColor,
              color: textColor
            }}
            className="btn rair-button">
            Buy an ERC721 contract for {utils.formatEther(tokensRequired)}{' '}
            {tokenSymbol} tokens!
          </button>
          {tokensRequired.eq(0) && (
            <>
              <br />
              <button
                onClick={async () => {
                  if (!factoryInstance) {
                    return;
                  }
                  reactSwal.fire({
                    title: 'Adding new token to the Master Factory',
                    html: 'Please wait',
                    icon: 'info',
                    showConfirmButton: false
                  });
                  if (
                    await web3TxHandler(factoryInstance, 'add777Token', [
                      erc777Instance?.address,
                      '10000000000000000000'
                    ])
                  ) {
                    reactSwal.fire({
                      title: 'Success',
                      html: 'Token added',
                      icon: 'success'
                    });
                  }
                }}
                style={{
                  background: secondaryButtonColor,
                  color: textColor
                }}
                className="btn rair-button">
                Accept new token into the Master Factory
              </button>
            </>
          )}
          {clientTokens?.lt(tokensRequired) && (
            <>
              {' '}
              <br />
              Insufficient {tokenSymbol} Tokens!{' '}
            </>
          )}
        </>
      ) : (
        'Fetching info...'
      )}
    </div>
  );
};

export default FactoryManager;
