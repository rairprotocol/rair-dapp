import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MultiOwnerModularAccount } from '@alchemy/aa-accounts';
import { AccountSigner } from '@alchemy/aa-ethers';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ethers from 'ethers';

import ProductManager from './CollectionManager';
import {
  IERC721Manager,
  ITokenInfo,
  ProductInfoType
} from './creatorMode.types';

import { abi } from '../../contracts/RAIR_ERC721.json';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';

const ERC721Manager: React.FC<IERC721Manager> = ({ tokenAddress }) => {
  const [erc721Instance, setERC721Instance] = useState<
    ethers.Contract | undefined
  >();
  const [tokenInfo, setTokenInfo] = useState<ITokenInfo>();

  const [minterApproved, setMinterApproved] = useState<boolean>();
  const [productName, setProductName] = useState<string>('');
  const [productLength, setProductLength] = useState<number>(0);
  const [existingProductsData /*setExistingProductsData*/] =
    useState<ProductInfoType[]>();
  const [refetchingFlag, setRefetchingFlag] = useState<boolean>(false);

  const { minterInstance, currentUserAddress, programmaticProvider } =
    useSelector<RootState, ContractsInitialType>(
      (state) => state.contractStore
    );
  const { textColor, secondaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const refreshData = useCallback(async () => {
    if (!erc721Instance) {
      return;
    }
    setRefetchingFlag(true);
    setMinterApproved(
      await erc721Instance?.hasRole(
        await erc721Instance.MINTER(),
        minterInstance?.address
      )
    );
    const tokInfo: ITokenInfo = {
      name: await erc721Instance?.name(),
      symbol: await erc721Instance?.symbol(),
      balance: (await erc721Instance.balanceOf(currentUserAddress)).toString(),
      address: erc721Instance?.address
    };
    setTokenInfo(tokInfo);
    setRefetchingFlag(false);
  }, [erc721Instance, currentUserAddress, minterInstance?.address]);

  useEffect(() => {
    if (erc721Instance) {
      refreshData();
    }
  }, [erc721Instance, refreshData]);

  useEffect(() => {
    let signer:
      | AccountSigner<MultiOwnerModularAccount>
      | ethers.Wallet
      | ethers.providers.JsonRpcSigner
      | undefined = programmaticProvider;
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner(0);
    }
    const erc721 = new ethers.Contract(tokenAddress, abi, signer);
    setERC721Instance(erc721);
  }, [programmaticProvider, tokenAddress]);

  return (
    <details
      className="text-center border border-white rounded"
      style={{ position: 'relative' }}>
      <summary className="py-1">
        <b>
          ERC721 {tokenInfo && tokenInfo.name}
          <br />
        </b>
      </summary>
      Contract Address: <b>{tokenAddress}</b>
      <button
        style={{ position: 'absolute', left: 0, top: 0, color: 'inherit' }}
        onClick={refreshData}
        disabled={refetchingFlag}
        className="btn">
        {refetchingFlag ? '...' : <FontAwesomeIcon icon={faRedo} />}
      </button>
      <br />
      <br />
      {tokenInfo && erc721Instance ? (
        <div className="row text-center mx-0 px-0">
          <div className="col-12 col-md-6 border border-secondary rounded">
            <h5> ERC721 Info </h5>
            Name: <b>{tokenInfo.name}</b>
            <br />
            Symbol: {tokenInfo.symbol}
            <br />
            <br />
            Current Balance: {tokenInfo.balance}
            <br />
          </div>
          <div className="col-12 col-md-6 border border-secondary rounded">
            <h5> Create a new product </h5>
            Product Name:{' '}
            <input
              className="w-50"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <br />
            {"Product's length"}:{' '}
            <input
              className="w-50"
              type="number"
              value={productLength}
              onChange={(e) => setProductLength(+e.target.value)}
            />
            <br />
            <button
              disabled={productName === '' || productLength === 0}
              onClick={() => {
                erc721Instance.createProduct(productName, productLength);
              }}
              style={{
                background: secondaryButtonColor,
                color: textColor
              }}
              className="btn rair-button">
              Create {productLength} tokens under product {productName}
            </button>
          </div>
          {minterApproved === false ? (
            <div className="col-12 col-md-6 border border-secondary rounded">
              To sell your unminted products
              <br />
              <button
                onClick={async () => {
                  erc721Instance.grantRole(
                    await erc721Instance.MINTER(),
                    minterInstance?.address
                  );
                }}
                className="btn btn-warning">
                Approve the Marketplace as a Minter!
              </button>
              <br />
              (once)
            </div>
          ) : (
            <div className="col-3" />
          )}
          <div className="col-12 col-md border border-secondary rounded">
            {existingProductsData && (
              <>
                <h5> Existing Products </h5>

                {existingProductsData.map((item, index) => {
                  return (
                    <ProductManager
                      key={index}
                      productIndex={index}
                      productInfo={item}
                      tokenInstance={erc721Instance}
                      tokenAddress={tokenInfo.address}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
      ) : (
        <>Fetching info...</>
      )}
    </details>
  );
};

export default ERC721Manager;
