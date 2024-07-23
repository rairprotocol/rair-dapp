//unused-component
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, utils } from 'ethers';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
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
    useState<BigNumber>(percentage);
  const { secondaryColor, primaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  useEffect(() => {
    setRecipientAddress(recipient);
  }, [recipient]);

  useEffect(() => {
    setPercentageReceived(BigNumber.from(percentage));
  }, [percentage]);

  const updatePercentage = (value: BigNumber) => {
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

  const calculatedFee = BigNumber.from(100)
    .mul(percentageReceived)
    .div(BigNumber.from(10).pow(minterDecimals));
  const calculatedPrice = BigNumber.from(price);
  const calculatedRemainder = calculatedFee.eq(0)
    ? BigNumber.from(1)
    : calculatedPrice.mod(calculatedFee);

  return (
    <tr
      className={`${!editable && 'text-secondary'} ${
        !calculatedRemainder.eq(0) && 'text-danger'
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
        {!calculatedFee.eq(0) && (
          <small>
            {percentageReceived.div(minterDecimals.pow(10)).toString()}% (
            {utils.formatEther(
              BigNumber.from(calculatedPrice).div(calculatedFee)
            )}{' '}
            {symbol})
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
