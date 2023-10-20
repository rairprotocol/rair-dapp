import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { utils } from 'ethers';
import { parseEther } from 'ethers/lib/utils';

import { BuySellButton } from './BuySellButton';

import { TUserResponse } from '../../../../axios.responseTypes';
import { erc721Abi } from '../../../../contracts';
import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { UserType } from '../../../../ducks/users/users.types';
import useSwal from '../../../../hooks/useSwal';
import useWeb3Tx from '../../../../hooks/useWeb3Tx';
import chainData from '../../../../utils/blockchainData';
import { rFetch } from '../../../../utils/rFetch';
import defaultImage from '../../../UserProfileSettings/images/defaultUserPictures.png';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import { ISellButton } from '../../mockupPage.types';

const SellButton: React.FC<ISellButton> = ({
  tokenData,
  selectedToken,
  sellingPrice,
  isInputPriceExist,
  setIsInputPriceExist,
  refreshResaleData,
  item,
  singleTokenPage
}) => {
  const { contractCreator, currentUserAddress, diamondMarketplaceInstance } =
    useSelector<RootState, ContractsInitialType>(
      (store) => store.contractStore
    );

  let { blockchain, contract, tokenId } = useParams();
  const [accountData, setAccountData] = useState<UserType | null>(null);

  if (!blockchain && !contract && !tokenId) {
    blockchain = item.contract.blockchain;
    contract = item.contract.contractAddress;
    tokenId = item.uniqueIndexInContract;
  }

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain } = useWeb3Tx();

  const handleClickSellButton = useCallback(async () => {
    const tokenInformation =
      item || (selectedToken && tokenData?.[selectedToken]);
    if (
      !contractCreator ||
      !sellingPrice ||
      !blockchain ||
      !chainData[blockchain] ||
      !correctBlockchain(blockchain as BlockchainType) ||
      !diamondMarketplaceInstance ||
      !tokenInformation
    ) {
      return;
    }
    const instance = contractCreator(contract, erc721Abi);
    if (!instance) {
      return;
    }
    reactSwal.fire({
      title: 'Please wait',
      html: 'Verifying connection with Marketplace',
      icon: 'info',
      showConfirmButton: false
    });
    const isApprovedForAll = await web3TxHandler(instance, 'isApprovedForAll', [
      currentUserAddress,
      diamondMarketplaceInstance.address
    ]);
    if (!isApprovedForAll) {
      reactSwal.fire({
        title: 'Approving the Marketplace',
        html: 'Allow the marketplace to transfer the tokens you put for sale',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await web3TxHandler(instance, 'setApprovalForAll', [
          diamondMarketplaceInstance.address,
          true
        ])
      ) {
        await reactSwal.fire(
          'Success',
          'You can now put your NFTs up for sale',
          'success'
        );
      }
    }
    reactSwal.fire({
      title: 'Creating resale offer',
      html: `Posting NFT #${tokenId} up for sale with price ${sellingPrice} ${chainData[blockchain]?.symbol}`,
      icon: 'info',
      showConfirmButton: false
    });
    const response = await rFetch(`/api/resales/create`, {
      method: 'POST',
      body: JSON.stringify({
        contract,
        blockchain,
        index: tokenInformation.uniqueIndexInContract,
        price: parseEther(sellingPrice).toString()
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
    if (response.success) {
      reactSwal
        .fire({
          title: 'Success',
          html: `Users will be able to purchase your NFT on the marketplace`,
          icon: 'success'
        })
        .then((result) => {
          if (singleTokenPage && result.isConfirmed) {
            console.info(1, '1');
            location.reload();
          }
        });
      refreshResaleData();
    }
  }, [
    blockchain,
    contract,
    contractCreator,
    correctBlockchain,
    currentUserAddress,
    diamondMarketplaceInstance,
    reactSwal,
    sellingPrice,
    tokenId,
    web3TxHandler,
    refreshResaleData,
    item,
    tokenData,
    selectedToken,
    singleTokenPage
  ]);

  const openInputField = useCallback(() => {
    setIsInputPriceExist(true);
  }, [setIsInputPriceExist]);

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (
      !item &&
      selectedToken &&
      tokenData?.[selectedToken]?.ownerAddress &&
      utils.isAddress(tokenData?.[selectedToken]?.ownerAddress)
    ) {
      try {
        const result = await axios
          .get<TUserResponse>(
            `/api/users/${tokenData?.[selectedToken]?.ownerAddress}`
          )
          .then((res) => res.data);
        if (result.success) {
          setAccountData(result.user);
        }
      } catch (e) {
        setAccountData(null);
      }
    } else {
      if (item && utils.isAddress(item.ownerAddress)) {
        try {
          const result = await axios
            .get<TUserResponse>(`/api/users/${item.ownerAddress}`)
            .then((res) => res.data);
          if (result.success) {
            setAccountData(result.user);
          }
        } catch (e) {
          setAccountData(null);
        }
      }
    }
  }, [selectedToken, setAccountData, tokenData, item]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  const sellButton = useCallback(() => {
    if (
      selectedToken &&
      currentUserAddress === tokenData?.[selectedToken]?.ownerAddress &&
      tokenData?.[selectedToken]?.isMinted
    ) {
      return (
        <BuySellButton
          title={
            isInputPriceExist && sellingPrice
              ? `Sell for ${sellingPrice}`
              : 'Sell'
          }
          handleClick={sellingPrice ? handleClickSellButton : openInputField}
          isColorPurple={false}
          disabled={!sellingPrice || singleTokenPage}
        />
      );
    } else {
      if (item) {
        return (
          <BuySellButton
            title={sellingPrice ? `Sell for ${sellingPrice}` : 'Sell'}
            handleClick={sellingPrice ? handleClickSellButton : openInputField}
            isColorPurple={false}
            disabled={!sellingPrice}
          />
        );
      } else {
        return (
          <div className="container-sell-button-user">
            Owned by{' '}
            <div className="block-user-creator">
              <ImageLazy
                src={accountData?.avatar ? accountData.avatar : defaultImage}
                alt="User Avatar"
              />
              {selectedToken && (
                <NavLink to={`/${tokenData?.[selectedToken]?.ownerAddress}`}>
                  <h5>
                    {(accountData &&
                    accountData.nickName &&
                    accountData.nickName.length > 20
                      ? accountData.nickName.slice(0, 5) +
                        '....' +
                        accountData.nickName.slice(length - 4)
                      : accountData && accountData.nickName) ||
                      (tokenData?.[selectedToken]?.ownerAddress &&
                        tokenData?.[selectedToken]?.ownerAddress.slice(0, 4) +
                          '....' +
                          tokenData?.[selectedToken]?.ownerAddress.slice(
                            length - 4
                          ))}
                  </h5>
                </NavLink>
              )}
            </div>
          </div>
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blockchain,
    currentUserAddress,
    handleClickSellButton,
    openInputField,
    sellingPrice,
    selectedToken,
    tokenData,
    isInputPriceExist,
    accountData
  ]);

  return sellButton();
};

export default React.memo(SellButton);
