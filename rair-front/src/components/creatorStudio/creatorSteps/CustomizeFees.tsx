import React, { useCallback, useEffect, useState } from 'react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import InputField from '../../common/InputField';
import {
  ICustomizeFees,
  ICustomPayRateRow,
  TCustomizeFeesArrayItem
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const CustomPayRateRow: React.FC<ICustomPayRateRow> = ({
  index,
  array,
  receiver,
  deleter,
  percentage,
  renderer
}) => {
  const [receiverAddress, setReceiverAddress] = useState<string>(receiver);
  const [percentageReceived, setPercentageReceived] =
    useState<number>(percentage);
  const { secondaryColor, primaryColor } = useAppSelector(
    (store) => store.colors
  );

  useEffect(() => {
    setReceiverAddress(receiver);
  }, [receiver]);

  useEffect(() => {
    setPercentageReceived(percentage);
  }, [percentage]);

  const updatePercentage = (value: number) => {
    setPercentageReceived(value);
    array[index].percentage = Number(value);
    renderer();
  };

  const updateReceiver = (value: string) => {
    setReceiverAddress(value);
    array[index].receiver = value;
    renderer();
  };

  return (
    <tr>
      <th className="px-2">
        <div className="w-100 border-stimorol rounded-rair">
          <InputField
            labelClass="w-100 text-start"
            customClass="form-control rounded-rair"
            getter={receiverAddress}
            setter={updateReceiver}
            customCSS={{
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
          />
        </div>
      </th>
      <th className="px-2">
        <div className="w-100 border-stimorol rounded-rair">
          <InputField
            labelClass="w-100 text-start"
            customClass="form-control rounded-rair"
            min={0}
            max={100}
            type="number"
            getter={percentageReceived}
            setter={updatePercentage}
            customCSS={{
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
          />
        </div>
      </th>
      <th>
        <button
          onClick={() => deleter(index)}
          className="btn btn-danger rounded-rair">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </th>
    </tr>
  );
};

const CustomizeFees: React.FC<ICustomizeFees> = ({
  contractData,
  correctMinterInstance,
  setStepNumber,
  stepNumber,
  gotoNextStep
}) => {
  const { textColor, primaryColor } = useAppSelector((store) => store.colors);

  const rSwal = useSwal();

  const [customPayments, setCustomPayments] = useState<
    TCustomizeFeesArrayItem[]
  >([]);
  const [rerender, setRerender] = useState<boolean>(false);
  const [nodeFee, setNodeFee] = useState<number>(0);
  const [treasuryFee, setTreasuryFee] = useState<number>(0);
  const [minterDecimals, setMinterDecimals] = useState<number>(0);
  const [sendingData, setSendingData] = useState<boolean>(false);
  const getContractData = useCallback(async () => {
    if (!correctMinterInstance) {
      return;
    }
    setNodeFee(await correctMinterInstance.nodeFee());
    setTreasuryFee(await correctMinterInstance.treasuryFee());
    setMinterDecimals(await correctMinterInstance.feeDecimals());
  }, [correctMinterInstance]);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  const removePayment = (index: number) => {
    const aux = [...customPayments];
    aux.splice(index, 1);
    setCustomPayments(aux);
  };

  const addPayment = () => {
    const aux = [...customPayments];
    aux.push({
      receiver: '',
      percentage: 0
    });
    setCustomPayments(aux);
  };

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  const setCustomFees = useCallback(async () => {
    setSendingData(true);
    try {
      rSwal.fire({
        title: 'Setting custom fees',
        html: 'Please wait...',
        icon: 'info',
        showConfirmButton: false
      });
      await (
        await correctMinterInstance?.setCustomPayment(
          contractData?.product.offers &&
            contractData?.product?.offers[0]?.offerPool,
          customPayments.map((i) => i.receiver),
          customPayments.map((i) => i.percentage * Math.pow(10, minterDecimals))
        )
      )?.wait();
      rSwal.fire({
        title: 'Success',
        html: 'Custom fees set',
        icon: 'success',
        showConfirmButton: false
      });
      gotoNextStep();
    } catch (e) {
      console.error(e);
      rSwal.fire('Error', '', 'error');
    }
    setSendingData(false);
  }, [
    contractData?.product.offers,
    correctMinterInstance,
    customPayments,
    gotoNextStep,
    minterDecimals,
    rSwal
  ]);

  const total = customPayments.reduce((prev, current) => {
    return prev + current.percentage;
  }, 0);
  return (
    <div className="row px-0 mx-0">
      {contractData && customPayments?.length !== 0 && (
        <table className="col-12 text-start">
          <thead>
            <tr>
              <th>Recipient Address</th>
              <th>Percentage</th>
              <th />
            </tr>
          </thead>
          <tbody style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
            {customPayments.map((item, index) => {
              return (
                <CustomPayRateRow
                  key={index}
                  index={index}
                  array={customPayments}
                  deleter={removePayment}
                  renderer={() => setRerender(!rerender)}
                  {...item}
                />
              );
            })}
          </tbody>
        </table>
      )}
      <div className="col-12">
        Node Fee: {nodeFee / Math.pow(10, minterDecimals)}%, Treasury Fee:{' '}
        {treasuryFee / Math.pow(10, minterDecimals)}%
      </div>
      <div className="col-12">
        Total:{' '}
        {total +
          nodeFee / Math.pow(10, minterDecimals) +
          treasuryFee / Math.pow(10, minterDecimals)}
        %
      </div>
      <div className="col-12 mt-3 text-center">
        <div className="border-stimorol rounded-rair">
          <button
            onClick={addPayment}
            className={`btn btn-${primaryColor} rounded-rair px-4`}>
            Add new{' '}
            <FontAwesomeIcon
              icon={faPlus}
              style={{
                border: `solid 1px ${textColor}`,
                borderRadius: '50%',
                padding: '5px'
              }}
            />
          </button>
        </div>
      </div>
      <FixedBottomNavigation
        forwardFunctions={[
          {
            label: customPayments.length ? 'Set custom fees' : 'Continue',
            action: customPayments.length ? setCustomFees : gotoNextStep,
            disabled:
              sendingData || (customPayments.length ? total !== 90 : false)
          }
        ]}
      />
    </div>
  );
};

const ContextWrapper = (props: ICustomizeFees) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <CustomizeFees {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
