import React, { useCallback, useMemo } from 'react';
import { ISellButton } from '../../mockupPage.types';
import { BuySellButton } from './BuySellButton';

const SellButton: React.FC<ISellButton> = ({
  currentUser,
  tokenData,
  selectedToken,
  sellingPrice,
  isInputPriceExist,
  setIsInputPriceExist,
  setInputSellValue
}) => {
  const handleClickSellButton = useCallback(() => {
    setInputSellValue('');
    setIsInputPriceExist(false);
  }, [isInputPriceExist, sellingPrice]);

  const openInputField = useCallback(() => {
    setIsInputPriceExist(true);
  }, [isInputPriceExist]);

  const shrinkSellPrice = useMemo(() => {
    if (sellingPrice?.trim && sellingPrice.length < 3) {
      return sellingPrice;
    } else {
      return `${sellingPrice?.slice(0, 4)}... `;
    }
  }, [sellingPrice]);

  const sellButton = useCallback(() => {
    if (
      currentUser === tokenData[selectedToken]?.ownerAddress &&
      tokenData[selectedToken]?.isMinted
    ) {
      return (
        <BuySellButton
          title={
            isInputPriceExist && sellingPrice?.trim()
              ? `Sell for ${shrinkSellPrice} ETH`
              : 'Sell'
          }
          handleClick={
            isInputPriceExist ? handleClickSellButton : openInputField
          }
          isColorPurple={false}
          disabled={isInputPriceExist && !sellingPrice?.trim()}
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
    isInputPriceExist,
    shrinkSellPrice
  ]);

  return sellButton();
};

export default React.memo(SellButton);
