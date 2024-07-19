import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, utils } from 'ethers';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { validateInteger } from '../../../utils/metamaskUtils';
import InputField from '../../common/InputField';
import { ICustomFeeRow } from '../creatorStudio.types';

const CustomFeeRow: React.FC<ICustomFeeRow> = ({
  index,
  array,
  recipient,
  canBeContract,
  deleter,
  percentage,
  rerender,
  editable,
  message,
  minterDecimals,
  disabled,
  price,
  marketValuesChanged,
  setMarketValuesChanged,
  symbol
}) => {
  const precisionFactor = BigNumber.from(10).pow(minterDecimals);
  const [recipientAddress, setRecipientAddress] = useState<string | undefined>(
    recipient
  );
  const [canBeContractFlag, setCanBeContractFlag] =
    useState<boolean>(!!canBeContract);
  const [percentageReceived, setPercentageReceived] = useState<BigNumber>(
    BigNumber.from(percentage)
  );
  const { secondaryColor, primaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  useEffect(() => {
    setRecipientAddress(recipient);
  }, [recipient]);

  useEffect(() => {
    setRecipientAddress(recipient);
  }, [recipient]);

  const updatePercentage = (value: number) => {
    setPercentageReceived(BigNumber.from(!value ? 0 : value));
    array[index].percentage = BigNumber.from(value);
    if (rerender) {
      rerender();
    }
    if (!marketValuesChanged && setMarketValuesChanged) {
      setMarketValuesChanged(true);
    }
  };

  const updateRecipient = (value: string) => {
    setRecipientAddress(value);
    array[index].recipient = value;
    if (rerender) {
      rerender();
    }
    if (!marketValuesChanged && setMarketValuesChanged) {
      setMarketValuesChanged(true);
    }
  };

  const updateSmartContractFlag = () => {
    setCanBeContractFlag(!canBeContractFlag);
    array[index].canBeContract = !canBeContractFlag;
    if (rerender) {
      rerender();
    }
    if (!marketValuesChanged && setMarketValuesChanged) {
      setMarketValuesChanged(true);
    }
  };

  const calculatedFee = BigNumber.from(100)
    .mul(percentageReceived)
    .div(precisionFactor);
  const calculatedPrice = BigNumber.from(
    price && validateInteger(+price) ? Number(price) : 0
  );
  const calculatedRemainder = calculatedFee.eq(0)
    ? BigNumber.from(1)
    : calculatedPrice?.mod(calculatedFee);
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
        {editable && (
          <small className="float-end">
            <input
              id={`isSmart${index}`}
              type="checkbox"
              onChange={() => updateSmartContractFlag()}
              checked={canBeContractFlag}
            />
            <label className="ms-2" htmlFor={`isSmart${index}`}>
              Address is a smart contract
            </label>
          </small>
        )}
      </th>
      <th className="px-2">
        <div className="w-100 border-stimorol rounded-rair">
          <InputField
            disabled={!editable || disabled}
            labelClass="w-100 text-start"
            customClass="form-control rounded-rair"
            min={0}
            max={BigNumber.from(100).mul(precisionFactor).toString()}
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
            {percentageReceived.div(precisionFactor).toString()}% (
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

export default CustomFeeRow;
