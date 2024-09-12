import React, { useCallback, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { formatEther } from 'ethers';
import { Hex } from 'viem';

import { BuySellButton } from './BuySellButton';
import SellInputButton from './SellInputButton';

import useContracts from '../../../../hooks/useContracts';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../hooks/useReduxHooks';
import useServerSettings from '../../../../hooks/useServerSettings';
import useSwal from '../../../../hooks/useSwal';
import useWeb3Tx from '../../../../hooks/useWeb3Tx';
import { BillTransferIcon, GrandpaWait } from '../../../../images';
import { store } from '../../../../redux/store';
import { reloadTokenData } from '../../../../redux/tokenSlice';
import { rFetch } from '../../../../utils/rFetch';
import { ContractType } from '../../../adminViews/adminView.types';
import ResaleModal from '../../../nft/PersonalProfile/PersonalProfileMyNftTab/ResaleModal/ResaleModal';
import defaultImage from '../../../UserProfileSettings/images/defaultUserPictures.png';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import { ISerialNumberBuySell } from '../../mockupPage.types';
import SelectNumber from '../../SelectBox/SelectNumber/SelectNumber';

const SerialNumberBuySell: React.FC<ISerialNumberBuySell> = ({
  handleClickToken,
  blockchain,
  selectedToken,
  setSelectedToken,
  offerData,
  tokenDataForResale,
  serialNumberData
}) => {
  const { diamondMarketplaceInstance } = useContracts();
  const { currentUserAddress, exchangeRates } = useAppSelector(
    (state) => state.web3
  );
  const { primaryColor } = useAppSelector((store) => store.colors);
  const { databaseResales } = useAppSelector((store) => store.settings);
  const { currentCollection } = useAppSelector((store) => store.tokens);

  const dispatch = useAppDispatch();

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const numberTooBigThreshold = BigInt(10000000000);

  const [contractData, setContractData] = useState<ContractType>();
  const [resaleData, setResaleData] = useState<any>();
  const params = useParams();

  const buyContract = useCallback(async () => {
    if (
      !contractData ||
      !offerData ||
      !contractData.diamond ||
      !diamondMarketplaceInstance ||
      !selectedToken
    ) {
      return;
    }
    const marketplaceContract = diamondMarketplaceInstance;
    const marketplaceMethod = 'buyMintingOffer';
    const marketplaceArguments: any[] = [
      offerData.offerIndex, // Offer Index
      selectedToken // Token Index
    ];
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
          intendedBlockchain: blockchain as Hex,
          failureMessage:
            'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!',
          callback: () => {
            dispatch(
              reloadTokenData({
                tokenId: currentCollection?.[selectedToken]?._id
              })
            );
          },
          sponsored: offerData.sponsored
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
    contractData,
    offerData,
    diamondMarketplaceInstance,
    selectedToken,
    reactSwal,
    web3TxHandler,
    blockchain,
    dispatch,
    currentCollection
  ]);

  const { getBlockchainData } = useServerSettings();

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
      (currentCollection &&
        !currentCollection[selectedToken]?.uniqueIndexInContract)
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
      `/api/resales/open?contract=${params.contract}&blockchain=${
        params.blockchain
      }&index=${currentCollection[selectedToken].uniqueIndexInContract}`
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
    currentCollection,
    selectedToken
  ]);

  useEffect(() => {
    getResaleData();
  }, [getResaleData]);

  const resalePurchase = useCallback(async () => {
    if (!correctBlockchain(blockchain)) {
      web3Switch(blockchain);
      return;
    }
    if (
      !selectedToken ||
      !diamondMarketplaceInstance ||
      !currentCollection ||
      !params?.tokenId
    ) {
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
      imageUrl: currentCollection[selectedToken].metadata.image,
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
    if (databaseResales) {
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
            currentCollection[selectedToken]?.ownerAddress, // address seller,
            resaleData.tokenIndex, // uint token,
            resaleData.price, // uint tokenPrice,
            import.meta.env.VITE_NODE_ADDRESS, // address nodeAddress,
            hash, // bytes memory signature
            { value: resaleData.price }
          ],
          {
            callback: () => {
              getResaleData();
              dispatch(
                reloadTokenData({
                  tokenId: currentCollection?.[selectedToken]?._id
                })
              );
            },
            intendedBlockchain: blockchain
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
    correctBlockchain,
    blockchain,
    diamondMarketplaceInstance,
    currentCollection,
    params?.tokenId,
    params.contract,
    reactSwal,
    resaleData,
    selectedToken,
    databaseResales,
    web3TxHandler,
    web3Switch,
    currentUserAddress,
    getResaleData,
    dispatch
  ]);

  const checkAllSteps = useCallback(() => {
    if (!blockchain) {
      return <></>;
    }

    if (!currentUserAddress) {
      if (
        selectedToken &&
        currentCollection &&
        currentCollection[selectedToken]?.isMinted === true
      ) {
        const ownerData = currentCollection[selectedToken]?.ownerData;
        return (
          <div className="container-sell-button-user">
            Owned by{' '}
            <div className="block-user-creator">
              <ImageLazy
                src={ownerData?.avatar ? ownerData.avatar : defaultImage}
                alt="User Avatar"
              />
              {selectedToken && (
                <NavLink
                  to={`/${currentCollection[selectedToken]?.ownerAddress}`}>
                  <h5>
                    {(ownerData &&
                    ownerData.nickName &&
                    ownerData.nickName.length > 20
                      ? ownerData.nickName.slice(0, 5) +
                        '...' +
                        ownerData.nickName.slice(length - 4)
                      : ownerData && ownerData.nickName) ||
                      (currentCollection[selectedToken]?.ownerAddress &&
                        currentCollection[selectedToken]?.ownerAddress.slice(
                          0,
                          4
                        ) +
                          '...' +
                          currentCollection[selectedToken]?.ownerAddress.slice(
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
          handleClick={() => {
            web3Switch(blockchain);
          }}
          isColorPurple={true}
          title={`Switch network`}
        />
      );
    }

    // Blockchain is correct and offer exists
    if (
      selectedToken &&
      currentCollection &&
      !currentCollection[selectedToken]?.isMinted &&
      offerData
    ) {
      const rawPrice = BigInt(offerData?.price ? offerData?.price : 0);
      const price =
        numberTooBigThreshold >= rawPrice ? '0.000+' : formatEther(rawPrice);

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
              blockchain && getBlockchainData(blockchain)?.symbol
            }`}
          />
          {exchangeRates && (
            <div className="text-sell-button-usd-price">
              $
              {(
                Number(priceForUSD) * Number(exchangeRates[blockchain])
              ).toFixed(2)}
            </div>
          )}
        </>
      );
      // Token is minted
    } else if (
      selectedToken &&
      currentCollection &&
      currentCollection[selectedToken]?.isMinted
    ) {
      if (resaleData) {
        const price =
          numberTooBigThreshold >= resaleData.price
            ? '0.000+'
            : formatEther(resaleData.price);
        const priceForUSD = formatEther(resaleData.price);

        return (
          <>
            <BuySellButton
              disabled={resaleData.seller === currentUserAddress}
              isColorPurple={false}
              handleClick={resalePurchase}
              title={`Buy ${price} ${getBlockchainData(blockchain)?.symbol}`}
            />
            <small>Resale offer</small>
            {exchangeRates && (
              <div className="text-sell-button-usd-price">
                $
                {(
                  Number(priceForUSD) * Number(exchangeRates[blockchain])
                ).toFixed(2)}
              </div>
            )}
          </>
        );
      }
      // Current user is owner of the token
      if (
        currentCollection[selectedToken].ownerAddress ===
        currentUserAddress?.toLowerCase()
      ) {
        return (
          <SellInputButton
            selectedToken={selectedToken}
            refreshResaleData={getResaleData}
          />
        );
        // User is not owner and resale data exists
      } else {
        const firstData = Object.values(currentCollection)[0];
        return (
          <div className="container-sell-button-user">
            Owned by{' '}
            <div className="block-user-creator">
              <ImageLazy
                src={
                  firstData.ownerData?.avatar
                    ? firstData.ownerData.avatar
                    : defaultImage
                }
                alt="User Avatar"
              />
              {firstData && (
                <NavLink to={`/${firstData?.ownerAddress}`}>
                  <h5>
                    {(firstData.ownerData &&
                    firstData.ownerData.nickName &&
                    firstData.ownerData.nickName.length > 20
                      ? firstData.ownerData.nickName.slice(0, 5) +
                        '....' +
                        firstData.ownerData.nickName.slice(length - 4)
                      : firstData.ownerData && firstData.ownerData.nickName) ||
                      (firstData.ownerAddress &&
                        firstData.ownerAddress.slice(0, 4) +
                          '....' +
                          firstData.ownerAddress.slice(length - 4))}
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
    currentCollection,
    offerData,
    web3Switch,
    numberTooBigThreshold,
    contractData,
    buyContract,
    currentUserAddress,
    resaleData,
    resalePurchase,
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
          {currentCollection && Object.keys(currentCollection)?.length ? (
            <SelectNumber
              serialNumberData={serialNumberData}
              handleClickToken={handleClickToken}
              setSelectedToken={setSelectedToken}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      {currentCollection &&
        selectedToken &&
        tokenDataForResale &&
        currentCollection[selectedToken]?.isMinted &&
        currentUserAddress ===
          currentCollection[selectedToken].ownerAddress && (
          <button
            onClick={() => {
              reactSwal.fire({
                html: (
                  <Provider store={store}>
                    <ResaleModal
                      singleTokenPage={true}
                      item={tokenDataForResale}
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
