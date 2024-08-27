//unused-component
import React, { useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatEther } from 'ethers';

import { useAppSelector } from '../../../hooks/useReduxHooks';
import InputField from '../../common/InputField';
import { ICustomFeeRow } from '../creatorStudio.types';

const DiamondCustomPaymentRow: React.FC<ICustomFeeRow> = ({
  index,
  array,
  recipient,
  deleter,
  percentage,
  rerender,
  editable,
  message,
  minterDecimals,
  disabled,
  marketValuesChanged,
  setMarketValuesChanged,
  price,
  symbol
}) => {
  const [recipientAddress, setRecipientAddress] = useState<string | undefined>(
    recipient
  );
  const [percentageReceived, setPercentageReceived] =
    useState<bigint>(percentage);
  const { secondaryColor, primaryColor } = useAppSelector(
    (store) => store.colors
  );

  useEffect(() => {
    setRecipientAddress(recipient);
  }, [recipient]);

  useEffect(() => {
    setPercentageReceived(BigInt(percentage));
  }, [percentage]);

  const updatePercentage = (value: bigint) => {
    setPercentageReceived(value);
    array[index].percentage = value;
    rerender();
    if (!marketValuesChanged && setMarketValuesChanged) {
      setMarketValuesChanged(true);
    }
  };

  const updateRecipient = (value: string) => {
    setRecipientAddress(value);
    array[index].recipient = value;
    rerender();
    if (!marketValuesChanged && setMarketValuesChanged) {
      setMarketValuesChanged(true);
    }
  };

  const calculatedFee =
    (BigInt(100) * percentageReceived) / BigInt(10) ** minterDecimals;
  const calculatedPrice = BigInt(price || 0);
  const calculatedRemainder =
    calculatedFee === BigInt(0)
      ? BigInt(1)
      : calculatedPrice % BigInt(calculatedFee);

  return (
    <tr
      className={`${!editable && 'text-secondary'} ${
        !(calculatedRemainder === BigInt(0)) && 'text-danger'
      }`}>
      <th className="px-2">
        <div className="w-100 border-stimorol rounded-rair">
          <InputField
            disabled={!editable || disabled}
            labelClass="w-100 text-start"
            customClass="form-control rounded-rair"
            getter={recipientAddress}
            setter={updateRecipient}
            customCSS={{
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
          />
        </div>
        <small>{message}</small>
      </th>
      <th className="px-2">
        <div className="w-100 border-stimorol rounded-rair">
          <InputField
            disabled={!editable || disabled}
            labelClass="w-100 text-start"
            customClass="form-control rounded-rair"
            min={0}
            max={100 * Math.pow(10, Number(minterDecimals.toString()))}
            type="number"
            getter={percentageReceived.toString()}
            setter={updatePercentage}
            customCSS={{
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
          />
        </div>
        {calculatedFee !== BigInt(0) && (
          <small>
            {(percentageReceived / minterDecimals ** BigInt(10)).toString()}% (
            {formatEther(BigInt(calculatedPrice) / calculatedFee)} {symbol})
          </small>
        )}
      </th>
      <th style={{ width: '5vw' }}>
        {editable && (
          <button
            onClick={() => deleter(index)}
            className="btn btn-danger rounded-rair">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </th>
    </tr>
  );
};

export default DiamondCustomPaymentRow;
