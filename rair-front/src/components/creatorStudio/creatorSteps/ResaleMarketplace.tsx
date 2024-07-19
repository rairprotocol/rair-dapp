import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, utils } from 'ethers';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import chainData from '../../../utils/blockchainData';
import InputField from '../../common/InputField';
import CustomFeeRow from '../common/customFeeRow';
import { TCustomPayments, TResaleMarketplace } from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const CustomizeFees: React.FC<TResaleMarketplace> = ({
  contractData,
  setStepNumber,
  stepNumber,
  gotoNextStep
}) => {
  const { textColor, primaryColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const { diamondMarketplaceInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const [customPayments, setCustomPayments] = useState<TCustomPayments[]>([]);
  const [approving, setApproving] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [resaleAddress, setResaleAddress] = useState<string>(
    diamondMarketplaceInstance?.address || ''
  );
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
    if (!diamondMarketplaceInstance) {
      return;
    }
    const nodeFeeData = await diamondMarketplaceInstance.getNodeFee();
    if (nodeFeeData) {
      setNodeFee(nodeFeeData.nodeFee);
      setMinterDecimals(nodeFeeData.decimals);
      setPrecisionFactor(BigNumber.from(10).pow(nodeFeeData.decimals));
    }
    const treasuryFeeData = await diamondMarketplaceInstance.getTreasuryFee();
    if (treasuryFeeData) {
      setTreasuryFee(treasuryFeeData.treasuryFee);
    }
  }, [diamondMarketplaceInstance]);

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
      message: '',
      canBeContract: false
    });
    setCustomPayments(aux);
  };
  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  const setCustomFees = async () => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    setSendingData(true);
    try {
      reactSwal.fire({
        title: 'Setting custom fees',
        html: 'Please wait...',
        icon: 'info',
        showConfirmButton: false
      });
      if (
        await web3TxHandler(diamondMarketplaceInstance, 'setRoyalties', [
          contractData?.contractAddress,
          customPayments.map((item) => ({
            recipient: item.recipient,
            percentage: item.percentage
          }))
        ])
      ) {
        reactSwal.fire({
          title: 'Success',
          html: 'Custom fees set',
          icon: 'success',
          showConfirmButton: false
        });
        gotoNextStep();
      }
    } catch (e) {
      console.error(e);
      reactSwal.fire('Error', '', 'error');
    }
    setSendingData(false);
  };

  const validatePaymentData = () => {
    if (customPayments.length) {
      let valid = true;
      let total = BigNumber.from(0);
      for (const payment of customPayments) {
        valid = valid && utils.isAddress(payment.recipient || '');
        total = total.add(payment.percentage);
      }
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
                  symbol={chainData[contractData.blockchain]?.symbol}
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
          %
          <br />
          Total:{' '}
          {total
            .add(nodeFee)
            .add(treasuryFee)
            .div(BigNumber.from(10).pow(minterDecimals))
            .toString()}
          %
          <br />
          Percentage left for the seller:{' '}
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
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="btn col-12 rair-button"
            onClick={async () => {
              setApproving(true);
              reactSwal.fire({
                title: 'Approving address',
                html: 'Please wait...',
                icon: 'info',
                showConfirmButton: false
              });
              if (
                await web3TxHandler(contractData?.instance, 'grantRole', [
                  await web3TxHandler(contractData.instance, 'TRADER', []),
                  resaleAddress
                ])
              ) {
                reactSwal.fire(
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
      {chainData && contractData && (
        <FixedBottomNavigation
          forwardFunctions={[
            {
              label: `Switch to ${chainData[contractData?.blockchain]?.name}`,
              action: () => web3Switch(contractData?.blockchain),
              disabled: correctBlockchain(
                contractData?.blockchain as BlockchainType
              ),
              visible: !correctBlockchain(
                contractData?.blockchain as BlockchainType
              )
            },
            {
              label: 'Set custom fees',
              action: setCustomFees,
              disabled:
                sendingData ||
                !validatePaymentData() ||
                !diamondMarketplaceInstance,
              visible: !!customPayments.length
            },
            {
              label: 'Continue',
              action: gotoNextStep,
              visible: !customPayments.length
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
