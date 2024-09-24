import { FC, memo, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { parseEther } from 'ethers';
import { Hex } from 'viem';

import { BuySellButton } from './BuySellButton';

import { erc721Abi } from '../../../../contracts';
import useContracts from '../../../../hooks/useContracts';
import { useAppSelector } from '../../../../hooks/useReduxHooks';
import useServerSettings from '../../../../hooks/useServerSettings';
import useSwal from '../../../../hooks/useSwal';
import useWeb3Tx from '../../../../hooks/useWeb3Tx';
import { rFetch } from '../../../../utils/rFetch';
import defaultImage from '../../../UserProfileSettings/images/defaultUserPictures.png';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import { ISellButton } from '../../mockupPage.types';

const SellButton: FC<ISellButton> = ({
  selectedToken,
  sellingPrice,
  isInputPriceExist,
  setIsInputPriceExist,
  refreshResaleData,
  item,
  singleTokenPage
}) => {
  const { contractCreator, diamondMarketplaceInstance } = useContracts();
  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const { currentCollection, currentCollectionMetadata } = useAppSelector(
    (store) => store.tokens
  );

  const xMIN = Number(0.0001);
  const yMAX = item?.contract?.blockchain === '0x1' ? 10 : 10000.0;

  const blockchain =
    item?.contract?.blockchain ||
    currentCollectionMetadata?.contract?.blockchain;
  const contract =
    item?.contract?.contractAddress ||
    currentCollectionMetadata?.contract?.contractAddress;
  const tokenId = item?.uniqueIndexInContract;

  const reactSwal = useSwal();
  const { web3TxHandler, web3Switch, correctBlockchain } = useWeb3Tx();
  const { getBlockchainData } = useServerSettings();
  const { nodeAddress, databaseResales } = useAppSelector(
    (store) => store.settings
  );

  const handleClickSellButton = useCallback(async () => {
    if (!correctBlockchain(blockchain as Hex)) {
      web3Switch(blockchain as Hex);
      return;
    }
    const tokenInformation = item || {
      ...(selectedToken && currentCollection?.[selectedToken]),
      contract: currentCollectionMetadata
    };
    if (
      !contractCreator ||
      !sellingPrice ||
      !blockchain ||
      !getBlockchainData(blockchain as Hex) ||
      !correctBlockchain(blockchain as Hex) ||
      !diamondMarketplaceInstance ||
      !tokenInformation
    ) {
      return;
    }
    const instance = contractCreator(contract as Hex, erc721Abi);
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
      await diamondMarketplaceInstance.getAddress()
    ]);
    if (!isApprovedForAll) {
      reactSwal.fire({
        title: 'Approving the Marketplace',
        html: 'Allow the marketplace to transfer the tokens you put for sale',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        !(await web3TxHandler(
          instance,
          'setApprovalForAll',
          [await diamondMarketplaceInstance.getAddress(), true],
          {
            intendedBlockchain: tokenInformation.contract.blockchain,
            sponsored: tokenInformation.offer.sponsored
          }
        ))
      ) {
        return;
      }
      await reactSwal.fire(
        'Success',
        'You can now put your NFTs up for sale',
        'success'
      );
    }
    reactSwal.fire({
      title: 'Creating resale offer',
      html: `Posting NFT #${tokenId} up for sale with price ${sellingPrice} ${
        getBlockchainData(blockchain as `0x${string}`)?.symbol
      }`,
      icon: 'info',
      showConfirmButton: false
    });
    let response;
    if (databaseResales) {
      response = await rFetch(`/api/resales/create`, {
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
    } else if (
      await web3TxHandler(
        diamondMarketplaceInstance,
        'createGasTokenOffer',
        [
          contract, // ERC721 address
          tokenId, // Token number
          parseEther(sellingPrice).toString(), // Token Price
          nodeAddress // Node address
        ],
        {
          intendedBlockchain: tokenInformation.contract.blockchain,
          sponsored: tokenInformation.offer.sponsored
        }
      )
    ) {
      response = { success: true };
    }
    if (response?.success) {
      reactSwal.fire({
        title: 'Success',
        html: `Users will be able to purchase your NFT on the marketplace`,
        icon: 'success'
      });
      refreshResaleData();
    }
  }, [
    blockchain,
    contract,
    contractCreator,
    web3Switch,
    correctBlockchain,
    currentUserAddress,
    diamondMarketplaceInstance,
    reactSwal,
    sellingPrice,
    tokenId,
    web3TxHandler,
    refreshResaleData,
    item,
    currentCollection,
    selectedToken,
    nodeAddress,
    getBlockchainData,
    databaseResales,
    currentCollectionMetadata
  ]);

  const openInputField = useCallback(() => {
    setIsInputPriceExist(true);
  }, [setIsInputPriceExist]);

  const sellButton = useCallback(() => {
    if (
      selectedToken &&
      currentUserAddress === currentCollection?.[selectedToken]?.ownerAddress &&
      currentCollection?.[selectedToken]?.isMinted
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
          disabled={
            !sellingPrice ||
            singleTokenPage ||
            Number(sellingPrice) < Number(xMIN) ||
            Number(sellingPrice) > Number(yMAX)
          }
        />
      );
    } else {
      if (item) {
        return (
          <BuySellButton
            title={sellingPrice ? `Sell for ${sellingPrice}` : 'Sell'}
            handleClick={sellingPrice ? handleClickSellButton : openInputField}
            isColorPurple={false}
            disabled={
              !sellingPrice ||
              Number(sellingPrice) < Number(xMIN) ||
              Number(sellingPrice) > Number(yMAX)
            }
          />
        );
      } else if (selectedToken) {
        const ownerData = currentCollection?.[selectedToken].ownerData;
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
                  to={`/${currentCollection?.[selectedToken]?.ownerAddress}`}>
                  <h5>
                    {(ownerData &&
                    ownerData.nickName &&
                    ownerData.nickName.length > 20
                      ? ownerData.nickName.slice(0, 5) +
                        '...' +
                        ownerData.nickName.slice(length - 4)
                      : ownerData && ownerData.nickName) ||
                      (currentCollection?.[selectedToken]?.ownerAddress &&
                        currentCollection?.[selectedToken]?.ownerAddress.slice(
                          0,
                          4
                        ) +
                          '...' +
                          currentCollection?.[
                            selectedToken
                          ]?.ownerAddress.slice(length - 4))}
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
    currentCollection,
    isInputPriceExist
  ]);

  return sellButton();
};

export default memo(SellButton);
