import React, { useCallback, useEffect, useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { BigNumber, constants, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { BuySellButton } from './BuySellButton';
import SellInputButton from './SellInputButton';

import { TUserResponse } from '../../../../axios.responseTypes';
import store, { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { UserType } from '../../../../ducks/users/users.types';
import useSwal from '../../../../hooks/useSwal';
import useWeb3Tx from '../../../../hooks/useWeb3Tx';
import { BillTransferIcon, GrandpaWait } from '../../../../images';
import chainData from '../../../../utils/blockchainData';
import { rFetch } from '../../../../utils/rFetch';
import { ContractType } from '../../../adminViews/adminView.types';
import useServerSettings from '../../../adminViews/useServerSettings';
import ResaleModal from '../../../nft/PersonalProfile/PersonalProfileMyNftTab/ResaleModal/ResaleModal';
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
  offerData,
  handleTokenBoughtButton,
  tokenDataForResale
}) => {
  const {
    minterInstance,
    diamondMarketplaceInstance,
    currentUserAddress,
    coingeckoRates
  } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );

  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const numberTooBigThreshold = BigNumber.from(10000000000);

  const [accountData, setAccountData] = useState<UserType | null>(null);
  const [contractData, setContractData] = useState<ContractType>();
  const [resaleData, setResaleData] = useState<any>();
  const params = useParams();

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (
      selectedToken &&
      tokenData?.[selectedToken]?.ownerAddress &&
      utils.isAddress(tokenData?.[selectedToken]?.ownerAddress) &&
      tokenData?.[selectedToken]?.ownerAddress !== constants.AddressZero
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

  const buyContract = useCallback(async () => {
    if (!contractData || !offerData) {
      return;
    }
    let marketplaceContract, marketplaceMethod, marketplaceArguments;
    if (contractData.diamond) {
      if (!diamondMarketplaceInstance) {
        return;
      }
      marketplaceContract = diamondMarketplaceInstance;
      marketplaceMethod = 'buyMintingOffer';
      marketplaceArguments = [
        offerData.offerIndex, // Offer Index
        selectedToken // Token Index
      ];
    } else {
      if (!minterInstance) {
        return;
      }
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
    reactSwal.fire({
      title: 'Buying token',
      html: (
        <>
          Awaiting transaction completion
          <div className="wait-minting-token">
            <img src={`${GrandpaWait}`} alt="waiting minting token" />
          </div>
        </>
      ),
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(
        marketplaceContract,
        marketplaceMethod,
        marketplaceArguments,
        {
          intendedBlockchain: blockchain as BlockchainType,
          failureMessage:
            'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!',
          callback: handleTokenBoughtButton,
          sponsored: offerData.sponsored
        }
      )
    ) {
      reactSwal.fire(
        'Success',
        'Now, you are the owner of this token',
        'success'
      );
      handleTokenBoughtButton();
    }
  }, [
    contractData,
    offerData,
    reactSwal,
    web3TxHandler,
    blockchain,
    handleTokenBoughtButton,
    diamondMarketplaceInstance,
    selectedToken,
    minterInstance
  ]);

  const { settings } = useServerSettings();

  useEffect(() => {
    if (offerData) {
      (async () => {
        const contractInfo = await rFetch(
          `/api/contracts/${offerData.contract}`
        );
        setContractData(contractInfo?.contract);
      })();
    }
  }, [offerData]);

  const getResaleData = useCallback(async () => {
    if (
      !diamondMarketplaceInstance ||
      !selectedToken ||
      !tokenData?.[selectedToken]
    ) {
      return;
    }
    const contractResponse = await rFetch(
      `/api/contracts?contractAddress=${params.contract}&blockchain=${params.blockchain}`
    );
    if (!contractResponse.success) {
      return;
    }
    const contractData = contractResponse?.result?.at(0);
    if (!contractData) {
      return;
    }
    setResaleData(undefined);
    const resaleResponse = await rFetch(
      `/api/resales/open?contract=${params.contract}&blockchain=${params.blockchain}&index=${tokenData[selectedToken].uniqueIndexInContract}`
    );
    if (!resaleResponse.success) {
      return;
    }
    const fetchedResaleData = resaleResponse?.data?.[0];
    if (!fetchedResaleData) {
      return;
    }
    const userResponse = await rFetch(
      `/api/users/${fetchedResaleData.seller.toLowerCase()}`
    );
    if (userResponse.success) {
      fetchedResaleData.seller = userResponse.user.nickName;
    }
    setResaleData(fetchedResaleData);
  }, [
    diamondMarketplaceInstance,
    params.contract,
    params.blockchain,
    tokenData,
    selectedToken
  ]);

  useEffect(() => {
    getResaleData();
  }, [getResaleData]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  const resalePurchase = useCallback(async () => {
    if (!correctBlockchain(blockchain as BlockchainType)) {
      web3Switch(blockchain as BlockchainType);
      return;
    }
    if (!diamondMarketplaceInstance || !tokenData || !params?.tokenId) {
      return;
    }
    /*
    const royalties = await diamondMarketplaceInstance.getRoyalties(
      params.contract
    );
    if (royalties) {
      const readableRoyalties = royalties.map((royalty) => ({
        address: royalty.recipient,
        percentage: formatUnits(royalty.percentage, 3)
      }));
      // Here is the array of royalties
      // console.info(readableRoyalties);
    }
    */
    const { isConfirmed } = await reactSwal.fire({
      imageUrl: tokenData[params.tokenId].metadata.image,
      imageHeight: '25vh',
      title: 'Purchase token',
      html: <>Currently owned by: {resaleData.seller}</>,
      showCancelButton: true
    });
    if (!isConfirmed || !selectedToken) {
      return;
    }
    reactSwal.fire({
      title: 'Please wait',
      html: 'Preparing transaction',
      icon: 'info',
      showConfirmButton: false
    });
    if (settings.databaseResales) {
      const { success, hash } = await rFetch(
        `/api/resales/purchase/${resaleData._id}`
      );
      if (
        success &&
        (await web3TxHandler(
          diamondMarketplaceInstance,
          'purchaseTokenOffer',
          [
            params.contract, // address erc721,
            currentUserAddress, // address buyer,
            tokenData?.[selectedToken]?.ownerAddress, // address seller,
            resaleData.tokenIndex, // uint token,
            resaleData.price, // uint tokenPrice,
            import.meta.env.VITE_NODE_ADDRESS, // address nodeAddress,
            hash, // bytes memory signature
            { value: resaleData.price }
          ],
          {
            callback: () => {
              getResaleData();
              handleTokenBoughtButton();
            },
            intendedBlockchain: blockchain as BlockchainType
          }
        ))
      ) {
        reactSwal.fire('Success', 'Token purchased', 'success');
      }
    } else if (
      resaleData.blockchainOfferId !== undefined &&
      (await web3TxHandler(
        diamondMarketplaceInstance,
        'purchaseGasTokenOffer',
        [resaleData.blockchainOfferId, { value: resaleData.price }]
      ))
    ) {
      reactSwal.fire('Success', 'Token purchased', 'success');
    }
  }, [
    web3Switch,
    diamondMarketplaceInstance,
    reactSwal,
    resaleData,
    web3TxHandler,
    handleTokenBoughtButton,
    blockchain,
    params,
    currentUserAddress,
    selectedToken,
    tokenData,
    getResaleData,
    correctBlockchain,
    settings.databaseResales
  ]);

  const checkAllSteps = useCallback(() => {
    if (!blockchain) {
      return <></>;
    }

    if (!currentUserAddress) {
      if (
        selectedToken &&
        tokenData &&
        tokenData?.[selectedToken]?.isMinted === true
      ) {
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

      if (!correctBlockchain(blockchain)) {
        return (
          <BuySellButton
            // handleClick={() => web3Switch(blockchain)}
            isColorPurple={true}
            title={`Log in to buy`}
            disabled={true}
          />
        );
      }
    }

    // Blockchain is not correct
    if (currentUserAddress && !correctBlockchain(blockchain)) {
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

      const priceForUSD = formatEther(rawPrice);

      if (
        !contractData ||
        !offerData?.offerIndex ||
        (contractData.diamond
          ? !offerData.diamondRangeIndex
          : !offerData.offerPool)
      ) {
        return <></>;
      }

      return (
        <>
          <BuySellButton
            handleClick={buyContract}
            isColorPurple={true}
            title={`Buy ${price} ${
              blockchain && chainData[blockchain]?.symbol
            }`}
          />
          {coingeckoRates && (
            <div className="text-sell-button-usd-price">
              $
              {(
                Number(priceForUSD) * Number(coingeckoRates[blockchain])
              ).toFixed(2)}
            </div>
          )}
        </>
      );
      // Token is minted
    } else if (selectedToken && tokenData?.[selectedToken]?.isMinted) {
      if (resaleData) {
        const price = numberTooBigThreshold.gte(resaleData.price)
          ? '0.000+'
          : formatEther(resaleData.price);
        const priceForUSD = formatEther(resaleData.price);

        return (
          <>
            <BuySellButton
              disabled={resaleData.seller === currentUserAddress}
              isColorPurple={false}
              handleClick={resalePurchase}
              title={`Buy ${price} ${chainData[blockchain]?.symbol}`}
            />
            <small>Resale offer</small>
            {coingeckoRates && (
              <div className="text-sell-button-usd-price">
                $
                {(
                  Number(priceForUSD) * Number(coingeckoRates[blockchain])
                ).toFixed(2)}
              </div>
            )}
          </>
        );
      }
      // Current user is owner of the token
      if (
        tokenData[selectedToken].ownerAddress ===
        currentUserAddress?.toLowerCase()
      ) {
        return (
          <SellInputButton
            tokenData={tokenData}
            selectedToken={selectedToken}
            refreshResaleData={getResaleData}
          />
        );
        // User is not owner and resale data exists
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
    correctBlockchain,
    selectedToken,
    tokenData,
    offerData,
    web3Switch,
    numberTooBigThreshold,
    contractData,
    buyContract,
    currentUserAddress,
    resaleData,
    resalePurchase,
    accountData,
    getResaleData
  ]);

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
      {tokenData &&
        selectedToken &&
        tokenDataForResale &&
        tokenData?.[selectedToken]?.isMinted &&
        currentUserAddress === tokenData[selectedToken].ownerAddress && (
          <button
            onClick={() => {
              reactSwal.fire({
                html: (
                  <Provider store={store}>
                    <ResaleModal
                      textColor={textColor}
                      singleTokenPage={true}
                      item={tokenDataForResale}
                      reloadFunction={handleTokenBoughtButton}
                    />
                  </Provider>
                ),
                showConfirmButton: false,
                showCloseButton: true,
                customClass: `resale-pop-up-custom ${
                  primaryColor === 'rhyno' ? 'rhyno' : ''
                }`
              });
            }}
            className="nft-item-sell-buton">
            <BillTransferIcon primaryColor={primaryColor} />
          </button>
        )}
      <div>{checkAllSteps()}</div>
    </div>
  );
};

export default SerialNumberBuySell;
