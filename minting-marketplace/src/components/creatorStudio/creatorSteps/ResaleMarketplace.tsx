//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import chainData from '../../../utils/blockchainData';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import FixedBottomNavigation from '../FixedBottomNavigation';
import CustomFeeRow from '../common/customFeeRow';
import { utils } from 'ethers';
import InputField from '../../common/InputField';
import { metamaskCall } from '../../../utils/metamaskUtils';
import { TCustomPayments, TResaleMarketplace } from '../creatorStudio.types';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';

const CustomizeFees: React.FC<TResaleMarketplace> = ({
  contractData,
  correctMinterInstance,
  setStepNumber,
  stepNumber,
  gotoNextStep,
  goBack,
  simpleMode
}) => {
  const { textColor, primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const [customPayments, setCustomPayments] = useState<TCustomPayments[]>(
    simpleMode
      ? [
          {
            recipient: currentUserAddress,
            percentage: 30,
            editable: true,
            message: 'Your address'
          }
        ]
      : []
  );
  const [approving, setApproving] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [resaleAddress, setResaleAddress] = useState<string>('');
  const [nodeFee, setNodeFee] = useState<number>(0);
  const [treasuryFee, setTreasuryFee] = useState<number>(0);
  const [minterDecimals, setMinterDecimals] = useState<number>(0);
  const [sendingData /*, setSendingData*/] = useState<boolean>(false);

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
      recipient: '',
      percentage: 0,
      editable: true,
      message: ''
    });
    setCustomPayments(aux);
  };
  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  //TODO: unused-snippet
  // const setCustomFees = async () => {
  //   setSendingData(true);
  //   try {
  //     Swal.fire({
  //       title: 'Setting custom fees',
  //       html: 'Please wait...',
  //       icon: 'info',
  //       showConfirmButton: false
  //     });
  //     Swal.fire({
  //       title: 'Success',
  //       html: 'Custom fees set',
  //       icon: 'success',
  //       showConfirmButton: false
  //     });
  //     gotoNextStep();
  //   } catch (e) {
  //     console.error(e);
  //     Swal.fire('Error', '', 'error');
  //   }
  //   setSendingData(false);
  // };

  const total = customPayments.reduce((prev, current) => {
    return prev + current.percentage;
  }, 0);
  return (
    <div className="row px-0 mx-0">
      {false && contractData && customPayments?.length !== 0 && (
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
                <CustomFeeRow
                  key={index}
                  index={index}
                  array={customPayments}
                  deleter={removePayment}
                  rerender={() => setRerender(!rerender)}
                  minterDecimals={minterDecimals}
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
            disabled={true}
            onClick={addPayment}
            className={`btn btn-${primaryColor} rounded-rair px-4`}>
            Add new{' '}
            <i
              className="fas fa-plus"
              style={{
                border: `solid 1px ${textColor}`,
                borderRadius: '50%',
                padding: '5px'
              }}
            />
          </button>
        </div>
      </div>
      {!simpleMode && contractData?.instance && (
        <div className="w-100 row">
          <hr />
          <div className="col-12">
            <InputField
              label="Contract address"
              getter={resaleAddress}
              setter={setResaleAddress}
              customClass="form-control"
            />
          </div>
          <button
            disabled={!utils.isAddress(resaleAddress) || approving}
            className="btn col-12 btn-stimorol"
            onClick={async () => {
              setApproving(true);
              Swal.fire({
                title: 'Approving address',
                html: 'Please wait...',
                icon: 'info',
                showConfirmButton: false
              });
              if (
                await metamaskCall(
                  contractData?.instance.grantRole(
                    await metamaskCall(contractData.instance.TRADER()),
                    resaleAddress
                  )
                )
              ) {
                Swal.fire(
                  'Success',
                  'The address has been approved to trade NFTs',
                  'success'
                );
              }
              setApproving(false);
            }}>
            Approve as a reseller!
          </button>
          <hr />
        </div>
      )}
      {chainData && (
        <FixedBottomNavigation
          backwardFunction={goBack}
          forwardFunctions={[
            {
              label: customPayments.length ? 'Set custom fees' : 'Continue',
              // There are no actions setup for now, the resale marketplace is not ready
              action: customPayments.length
                ? /*setCustomFees*/ gotoNextStep
                : gotoNextStep,
              disabled:
                sendingData || (customPayments.length ? total !== 90 : false)
            }
          ]}
        />
      )}
    </div>
  );
};

const ContextWrapper = (props: TResaleMarketplace) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <CustomizeFees {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
