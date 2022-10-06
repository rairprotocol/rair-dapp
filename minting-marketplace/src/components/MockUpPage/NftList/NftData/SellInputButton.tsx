import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import SellButton from './SellButton';

import { ISellInputButton } from '../../mockupPage.types';

const SellInputButton: React.FC<ISellInputButton> = ({
  currentUser,
  tokenData,
  selectedToken
}) => {
  const [inputSellValue, setInputSellValue] = useState<string>('');
  const [isInputPriceExist, setIsInputPriceExist] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  inputRef.current?.checkValidity();

  const handleInputClear = useCallback(() => {
    if (inputSellValue) {
      setInputSellValue('');
    } else {
      setIsInputPriceExist(false);
    }
  }, [inputSellValue, isInputPriceExist]);

  const handleSetValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (inputRef.current?.checkValidity()) {
        setInputSellValue(e.currentTarget.value);
      }
    },
    [setInputSellValue]
  );

  return (
    <div className="nft-data-sell-button">
      {isInputPriceExist && (
        <div className="input-sell-container">
          <input
            ref={inputRef}
            tabIndex={0}
            className="input-sell-value"
            type={'text'}
            value={inputSellValue}
            onChange={handleSetValue}
            placeholder="Choose the price"
            pattern="[0-9]+"
          />
          <CloseIcon
            className="input-sell-close-icon"
            fontSize="small"
            onClick={handleInputClear}
          />
        </div>
      )}
      <SellButton
        currentUser={currentUser}
        tokenData={tokenData}
        selectedToken={selectedToken}
        sellingPrice={inputSellValue}
        isInputPriceExist={isInputPriceExist}
        setIsInputPriceExist={setIsInputPriceExist}
        setInputSellValue={setInputSellValue}
      />
    </div>
  );
};

export default SellInputButton;
