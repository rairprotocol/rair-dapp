import { FC, useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import SellButton from './SellButton';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
import InputField from '../../../common/InputField';
import { ISellInputButton } from '../../mockupPage.types';

const SellInputButton: FC<ISellInputButton> = ({
  selectedToken,
  refreshResaleData
}) => {
  const [inputSellValue, setInputSellValue] = useState<string>('');
  const [isInputPriceExist, setIsInputPriceExist] = useState<boolean>(false);
  const { textColor, iconColor } = useAppSelector((store) => store.colors);

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
                  ? `${iconColor === '#1486c5' ? '#F95631' : iconColor}`
                  : `${iconColor === '#1486c5' ? '#E882D5' : iconColor}`
            }}
            className="input-sell-close-icon"
            fontSize="small"
            onClick={handleInputClear}
          />
        </div>
      )}
      <SellButton
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
