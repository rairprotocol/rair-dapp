import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';

import SellButton from './SellButton';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import InputField from '../../../common/InputField';
import { ISellInputButton } from '../../mockupPage.types';
import useServerSettings from '../../../adminViews/useServerSettings';

const SellInputButton: React.FC<ISellInputButton> = ({
  tokenData,
  selectedToken,
  refreshResaleData
}) => {
  const [inputSellValue, setInputSellValue] = useState<string>('');
  const [isInputPriceExist, setIsInputPriceExist] = useState<boolean>(false);
  const { textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const {customSecondaryButtonColor} = useServerSettings();

  const handleInputClear = useCallback(() => {
    if (inputSellValue) {
      setInputSellValue('');
    } else {
      setIsInputPriceExist(false);
    }
  }, [inputSellValue]);

  return (
    <div className="nft-data-sell-button">
      {isInputPriceExist && (
        <div className="input-sell-container">
          <InputField
            type="eth"
            getter={inputSellValue}
            setter={setInputSellValue}
            customClass={`input-sell-value text-${textColor}`}
            placeholder="Your price"
          />
          <CloseIcon
           style={{
            color:
              import.meta.env.VITE_TESTNET === 'true'
                ? `${
                    textColor === '#FFF' || textColor === 'black'
                      ? '#F95631'
                      : customSecondaryButtonColor
                  }`
                : `${
                    textColor === '#FFF' || textColor === 'black'
                      ? '#E882D5'
                      : customSecondaryButtonColor
                  }`
          }}
            className="input-sell-close-icon"
            fontSize="small"
            onClick={handleInputClear}
          />
        </div>
      )}
      <SellButton
        tokenData={tokenData}
        singleTokenPage={true}
        selectedToken={selectedToken}
        sellingPrice={inputSellValue}
        isInputPriceExist={isInputPriceExist}
        setIsInputPriceExist={setIsInputPriceExist}
        setInputSellValue={setInputSellValue}
        refreshResaleData={refreshResaleData}
      />
    </div>
  );
};

export default SellInputButton;
