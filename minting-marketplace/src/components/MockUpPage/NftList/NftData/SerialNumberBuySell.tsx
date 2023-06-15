import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import MetaMaskOnboarding from '@metamask/onboarding';
import axios from 'axios';
import { BigNumber, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { BuySellButton } from './BuySellButton';
import SellInputButton from './SellInputButton';

import { TUserResponse } from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { UserType } from '../../../../ducks/users/users.types';
import useSwal from '../../../../hooks/useSwal';
import useWeb3Tx from '../../../../hooks/useWeb3Tx';
import chainData from '../../../../utils/blockchainData';
import { rFetch } from '../../../../utils/rFetch';
import { web3Switch } from '../../../../utils/switchBlockchain';
import { ContractType } from '../../../adminViews/adminView.types';
import defaultImage from '../../../UserProfileSettings/images/defaultUserPictures.png';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import { ISerialNumberBuySell } from '../../mockupPage.types';
import SelectNumber from '../../SelectBox/SelectNumber/SelectNumber';
import { currentTokenData } from '../utils/currentTokenData';

const SerialNumberBuySell: React.FC<ISerialNumberBuySell> = ({
  tokenData,
  handleClickToken,
  blockchain,
  product,
  contract,
  totalCount,
  selectedToken,
  setSelectedToken,
  primaryColor,
  offerData,
  currentUser,
  handleTokenBoughtButton
}) => {
  const {
    resaleInstance,
    minterInstance,
    diamondMarketplaceInstance,
    currentChain,
    currentUserAddress
  } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );

  const numberTooBigThreshold = BigNumber.from(10000000000);

  const [accountData, setAccountData] = useState<UserType | null>(null);
  const [contractData, setContractData] = useState<ContractType>();
  const [resaleData, setResaleData] = useState<any>();
  const params = useParams();
  const { web3TxHandler } = useWeb3Tx();
  const reactSwal = useSwal();

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (
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
    }
  }, [selectedToken, setAccountData, tokenData]);

  const disableBuyBtn = useCallback(() => {
    // Returns true to DISABLE the button
    // Returs false to ENABLE the button
    if (!contractData || !offerData?.offerIndex) {
      return true;
    } else if (contractData.diamond) {
      return !offerData.diamondRangeIndex;
    } else {
      return !offerData.offerPool;
    }
  }, [offerData, contractData]);

  const buyContract = useCallback(async () => {
    if (
      !contractData ||
      !offerData ||
      !diamondMarketplaceInstance ||
      !minterInstance
    ) {
      return;
    }
    reactSwal.fire({
      title: 'Buying token',
      html: 'Awaiting transaction completion',
      icon: 'info',
      showConfirmButton: false
    });
    let marketplaceContract, marketplaceMethod, marketplaceArguments;
    if (contractData.diamond) {
      marketplaceContract = diamondMarketplaceInstance;
      marketplaceMethod = 'buyMintingOffer';
      marketplaceArguments = [
        offerData.offerIndex, // Offer Index
        selectedToken // Token Index
      ];
    } else {
      marketplaceContract = minterInstance;
      marketplaceMethod = 'buyToken';
      marketplaceArguments = [
        offerData?.offerPool, // Catalog Index
        offerData?.offerIndex, // Range Index
        selectedToken // Internal Token Index
      ];
    }
    marketplaceArguments.push({
      value: offerData.price
    });
    if (
      await web3TxHandler(
        marketplaceContract,
        marketplaceMethod,
        marketplaceArguments,
        {
          failureMessage:
            'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!',
          callback: handleTokenBoughtButton
        }
      )
    ) {
      reactSwal.fire(
        'Success',
        'Now, you are the owner of this token',
        'success'
      );
    }
  }, [
    reactSwal,
    web3TxHandler,
    minterInstance,
    offerData,
    diamondMarketplaceInstance,
    contractData,
    selectedToken,
    handleTokenBoughtButton
  ]);

  useEffect(() => {
    if (offerData) {
      (async () => {
        const contractInfo = await rFetch(
          `/api/v2/contracts/${offerData.contract}`
        );
        setContractData(contractInfo?.contract);
      })();
    }
  }, [offerData]);

  const getResaleData = useCallback(async () => {
    if (!resaleInstance) {
      return;
    }
    const contractResponse = await rFetch(
      `/api/v2/contracts?contractAddress=${params.contract}&blockchain=${params.blockchain}`
    );
    if (!contractResponse.success) {
      return;
    }
    const [contractData] = contractResponse?.data?.doc;
    if (!contractData) {
      return;
    }
    const resaleResponse = await rFetch(
      `/api/v2/resales?contract=${contractData._id}&tokenId=${params.tokenId}&status=0`,
      undefined,
      undefined,
      false
    );
    if (!resaleResponse.success) {
      return;
    }
    const [resaleData] = resaleResponse?.data?.doc;
    if (!resaleData) {
      return;
    }
    const userResponse = await rFetch(
      `/api/v2/users/${resaleData.operator.toLowerCase()}`
    );
    if (userResponse.success) {
      resaleData.operator = userResponse.user.nickName;
    }
    setResaleData(resaleData);
  }, [resaleInstance, params]);

  useEffect(() => {
    getResaleData();
  }, [getResaleData]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  const resalePurchase = useCallback(async () => {
    if (!resaleInstance) {
      return;
    }
    const { isConfirmed } = await reactSwal.fire({
      title: `Purchase token #${resaleData.tokenId}`,
      html: `Currently owned by: ${resaleData.operator}`,
      icon: 'info',
      showCancelButton: true
    });
    reactSwal.fire({
      title: `Please wait`,
      html: `Purchasing token #${resaleData.tokenId}`,
      icon: 'info',
      showConfirmButton: false
    });
    if (
      isConfirmed &&
      (await web3TxHandler(resaleInstance, 'buyResaleOffer', [
        resaleData.tradeid,
        {
          value: resaleData.price
        }
      ]))
    ) {
      reactSwal.fire(
        'Success',
        `You are now the owner of NFT #${resaleData.tokenId}`,
        'success'
      );
    }
  }, [resaleData, resaleInstance, reactSwal, web3TxHandler]);

  const checkAllSteps = useCallback(() => {
    if (!blockchain) {
      return <></>;
    }
    // Blockchain is not correct
    if (blockchain !== currentChain) {
      return (
        <BuySellButton
          handleClick={() => web3Switch(blockchain)}
          isColorPurple={true}
          title={`Switch network`}
        />
      );
    }
    // Blockchain is correct and offer exists
    if (selectedToken && !tokenData?.[selectedToken]?.isMinted && offerData) {
      const rawPrice = BigNumber.from(offerData?.price ? offerData?.price : 0);
      const price = numberTooBigThreshold.gte(rawPrice)
        ? '0.000+'
        : formatEther(rawPrice);
      return (
        <BuySellButton
          handleClick={buyContract}
          disabled={disableBuyBtn()}
          isColorPurple={true}
          title={`Buy ${price} ${blockchain && chainData[blockchain]?.symbol}`}
        />
      );
      // Token is minted
    } else if (selectedToken && tokenData?.[selectedToken]?.isMinted) {
      // Current user is owner of the token
      if (
        tokenData[selectedToken].ownerAddress ===
        currentUserAddress?.toLowerCase()
      ) {
        return (
          <SellInputButton
            currentUser={currentUser}
            tokenData={tokenData}
            selectedToken={selectedToken}
          />
        );
        // User is not owner and resale data exists
      } else if (resaleData) {
        const price = numberTooBigThreshold.gte(resaleData.price)
          ? '0.000+'
          : formatEther(resaleData.price);
        return (
          <>
            <BuySellButton
              isColorPurple={false}
              handleClick={resalePurchase}
              title={`Buy ${price} ${chainData[blockchain]?.symbol}`}
            />
            <small>Resale offer</small>
          </>
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
  }, [
    blockchain,
    currentChain,
    selectedToken,
    tokenData,
    offerData,
    numberTooBigThreshold,
    buyContract,
    disableBuyBtn,
    currentUserAddress,
    resaleData,
    currentUser,
    resalePurchase,
    accountData
  ]);

  useEffect(() => {
    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      reactSwal.fire({
        imageWidth: 70,
        imageHeight: 'auto',
        imageAlt: 'Custom image',
        imageUrl:
          'https://new-dev.rair.tech/static/media/RAIR-Tech-Logo-POWERED-BY-BLACK-2021.abf50c70.webp',
        title: 'Oops...',
        text: 'Please use the metamask mobile browser to explore further content or Metamask extension for browser.'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="main-tab">
      <div className="main-tab-description-serial-number">
        <div
          className="description-text serial-number-text"
          style={{
            color: `${primaryColor === 'rhyno' ? '#7A797A' : '#A7A6A6'}`
          }}>
          Serial number
        </div>
        <div>
          {tokenData && Object.keys(tokenData)?.length ? (
            <SelectNumber
              blockchain={blockchain}
              product={product}
              contract={contract}
              totalCount={totalCount}
              handleClickToken={handleClickToken}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              items={currentTokenData(tokenData)}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div>{checkAllSteps()}</div>
    </div>
  );
};

export default SerialNumberBuySell;
