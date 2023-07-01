import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { parseEther } from 'ethers/lib/utils';

import { BuySellButton } from './BuySellButton';

import { erc721Abi } from '../../../../contracts';
import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import useSwal from '../../../../hooks/useSwal';
import useWeb3Tx from '../../../../hooks/useWeb3Tx';
import chainData from '../../../../utils/blockchainData';
import { blockchain } from '../../../../utils/infoSplashData/markKohler';
import { ISellButton } from '../../mockupPage.types';

const SellButton: React.FC<ISellButton> = ({
  currentUser,
  tokenData,
  selectedToken,
  sellingPrice,
  isInputPriceExist,
  setIsInputPriceExist,
  setInputSellValue
}) => {
  const { resaleInstance, contractCreator, currentUserAddress } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  const { contract, tokenId } = useParams();

  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const handleClickSellButton = useCallback(async () => {
    if (
      !resaleInstance ||
      !contractCreator ||
      !sellingPrice ||
      !blockchain ||
      !chainData[blockchain]
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
      resaleInstance.address
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
          resaleInstance.address,
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
    if (
      await web3TxHandler(resaleInstance, 'createResaleOffer', [
        tokenId,
        parseEther(sellingPrice),
        contract,
        process.env.REACT_APP_NODE_ADDRESS
      ])
    ) {
      reactSwal.fire(
        'Success',
        'Your NFT can now be purchased by other users',
        'success'
      );
      setInputSellValue('');
      setIsInputPriceExist(false);
    }
  }, [
    contract,
    contractCreator,
    currentUserAddress,
    reactSwal,
    resaleInstance,
    sellingPrice,
    setInputSellValue,
    setIsInputPriceExist,
    tokenId,
    web3TxHandler
  ]);

  const openInputField = useCallback(() => {
    setIsInputPriceExist(true);
  }, [setIsInputPriceExist]);

  const sellButton = useCallback(() => {
    if (
      selectedToken &&
      currentUser === tokenData?.[selectedToken]?.ownerAddress &&
      tokenData?.[selectedToken]?.isMinted
    ) {
      return (
        <BuySellButton
          title={
            isInputPriceExist && sellingPrice
              ? `Sell for ${sellingPrice} ETH`
              : 'Sell'
          }
          handleClick={
            isInputPriceExist ? handleClickSellButton : openInputField
          }
          isColorPurple={false}
          disabled={isInputPriceExist && !sellingPrice}
        />
      );
    } else {
      return <></>;
    }
  }, [
    currentUser,
    handleClickSellButton,
    openInputField,
    sellingPrice,
    selectedToken,
    tokenData,
    isInputPriceExist
  ]);

  return sellButton();
};

export default React.memo(SellButton);
