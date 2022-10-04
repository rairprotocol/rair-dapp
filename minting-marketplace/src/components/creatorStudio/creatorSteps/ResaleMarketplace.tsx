//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber, utils } from 'ethers';
import Swal from 'sweetalert2';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import chainData from '../../../utils/blockchainData';
import { metamaskCall } from '../../../utils/metamaskUtils';
import { web3Switch } from '../../../utils/switchBlockchain';
import InputField from '../../common/InputField';
import CustomFeeRow from '../common/customFeeRow';
import { TCustomPayments, TResaleMarketplace } from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const CustomizeFees: React.FC<TResaleMarketplace> = ({
  contractData,
  setStepNumber,
  stepNumber,
  gotoNextStep,
  goBack
}) => {
  const { textColor, primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const { currentChain, resaleInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  const [customPayments, setCustomPayments] = useState<TCustomPayments[]>([]);
  const [approving, setApproving] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [resaleAddress, setResaleAddress] = useState<string>('');
  const [nodeFee, setNodeFee] = useState<BigNumber>(BigNumber.from(0));
  const [treasuryFee, setTreasuryFee] = useState<BigNumber>(BigNumber.from(0));
  const [minterDecimals, setMinterDecimals] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [precisionFactor, setPrecisionFactor] = useState<BigNumber>(
    BigNumber.from(10)
  );
  const [sendingData, setSendingData] = useState<boolean>(false);

  const getContractData = useCallback(async () => {
    if (!resaleInstance) {
      return;
    }
    setNodeFee(await resaleInstance.nodeFee());
    setTreasuryFee(await resaleInstance.treasuryFee());
    const feeDecimals = await resaleInstance.feeDecimals();
    if (feeDecimals !== 0) {
      setMinterDecimals(feeDecimals);
      setPrecisionFactor(BigNumber.from(10).pow(feeDecimals));
    }
  }, [resaleInstance]);

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
      percentage: precisionFactor,
      editable: true,
      message: ''
    });
    setCustomPayments(aux);
  };
  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  const setCustomFees = async () => {
    setSendingData(true);
    try {
      Swal.fire({
        title: 'Setting custom fees',
        html: 'Please wait...',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await metamaskCall(
          resaleInstance.setCustomRoyalties(
            contractData?.contractAddress,
            customPayments.map((item) => item.recipient),
            customPayments.map((item) => item.percentage)
          )
        )
      ) {
        Swal.fire({
          title: 'Success',
          html: 'Custom fees set',
          icon: 'success',
          showConfirmButton: false
        });
        gotoNextStep();
      }
    } catch (e) {
      console.error(e);
      Swal.fire('Error', '', 'error');
    }
    setSendingData(false);
  };

  const validatePaymentData = () => {
    if (customPayments.length) {
      let valid = true;
      let total = BigNumber.from(0);
      for (const payment of customPayments) {
        console.info(payment);
        valid = valid && utils.isAddress(payment.recipient);
        total = total.add(payment.percentage);
        console.info(total);
      }
      console.info(
        BigNumber.from(90).mul(precisionFactor).toString(),
        total.add(nodeFee).add(treasuryFee).toString()
      );
      if (
        BigNumber.from(90)
          .mul(precisionFactor)
          .gte(total.add(nodeFee).add(treasuryFee))
      ) {
        return valid;
      }
    }
    return false;
  };

  const total = customPayments.reduce((prev, current) => {
    return prev.add(current.percentage);
  }, BigNumber.from(0));
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
                <CustomFeeRow
                  key={index}
                  index={index}
                  array={customPayments}
                  deleter={removePayment}
                  rerender={() => setRerender(!rerender)}
                  minterDecimals={minterDecimals}
                  symbol={chainData[contractData.blockchain].symbol}
                  {...item}
                />
              );
            })}
          </tbody>
        </table>
      )}
      {nodeFee && treasuryFee && minterDecimals && (
        <div className="col-12">
          Node Fee: {BigNumber.from(nodeFee).div(precisionFactor).toString()}
          %
          <br />
          Treasury Fee:
          {BigNumber.from(treasuryFee).div(precisionFactor).toString()}
          <br />
          Total:{' '}
          {total
            .add(nodeFee)
            .add(treasuryFee)
            .div(BigNumber.from(10).pow(minterDecimals))
            .toString()}
          %
          <br />
          Percentage left for the buyer:{' '}
          {BigNumber.from(100)
            .mul(precisionFactor)
            .sub(total.add(nodeFee).add(treasuryFee))
            .div(BigNumber.from(10).pow(minterDecimals))
            .toString()}
          %
          <br />
        </div>
      )}
      <div className="col-12"></div>
      <div className="col-12 mt-3 text-center">
        <div className="border-stimorol rounded-rair">
          <button
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
      {contractData?.instance && (
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
              label: `Switch to ${
                chainData[contractData?.blockchain].name
              } for more options.`,
              action: () => web3Switch(contractData?.blockchain),
              disabled: contractData?.blockchain === currentChain,
              visible: contractData?.blockchain !== currentChain
            },
            {
              label: customPayments.length ? 'Set custom fees' : 'Continue',
              action: customPayments.length ? setCustomFees : gotoNextStep,
              disabled: sendingData || !validatePaymentData()
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
