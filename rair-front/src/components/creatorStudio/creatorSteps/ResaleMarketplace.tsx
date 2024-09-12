import { useCallback, useEffect, useState } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isAddress } from 'ethers';
import { Hex } from 'viem';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import useContracts from '../../../hooks/useContracts';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
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
  const { textColor, primaryColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );
  const { diamondMarketplaceInstance } = useContracts();

  const { getBlockchainData } = useServerSettings();

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const [customPayments, setCustomPayments] = useState<TCustomPayments[]>([]);
  const [approving, setApproving] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);
  const [nodeFee, setNodeFee] = useState<bigint>(BigInt(0));
  const [treasuryFee, setTreasuryFee] = useState<bigint>(BigInt(0));
  const [minterDecimals, setMinterDecimals] = useState<bigint>(BigInt(0));
  const [precisionFactor, setPrecisionFactor] = useState<bigint>(BigInt(10));
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [resaleAddress, setResaleAddress] = useState<string>('');

  const updateMarketAddress = useCallback(async () => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    setResaleAddress(await diamondMarketplaceInstance.getAddress());
  }, [diamondMarketplaceInstance]);

  useEffect(() => {
    updateMarketAddress();
  }, [updateMarketAddress]);

  const getContractData = useCallback(async () => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    const nodeFeeData = await diamondMarketplaceInstance.getNodeFee();
    if (nodeFeeData) {
      setNodeFee(nodeFeeData.nodeFee);
      setMinterDecimals(nodeFeeData.decimals);
      setPrecisionFactor(BigInt(10) ** BigInt(nodeFeeData.decimals));
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
      let total = BigInt(0);
      for (const payment of customPayments) {
        valid = valid && isAddress(payment.recipient || '');
        total = total + BigInt(payment.percentage);
      }
      if (BigInt(90) * precisionFactor >= total + nodeFee + treasuryFee) {
        return valid;
      }
    }
    return false;
  };

  const total = customPayments.reduce((prev, current) => {
    return prev + current.percentage;
  }, BigInt(0));
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
                  symbol={getBlockchainData(contractData.blockchain)?.symbol}
                  {...item}
                />
              );
            })}
          </tbody>
        </table>
      )}
      {!!nodeFee && !!treasuryFee && !!minterDecimals && (
        <div className="col-12">
          Node Fee: {(BigInt(nodeFee) / precisionFactor).toString()}
          %
          <br />
          Treasury Fee:
          {(BigInt(treasuryFee) / precisionFactor).toString()}
          %
          <br />
          Total:{' '}
          {(
            (total + nodeFee + treasuryFee) /
            BigInt(10) ** minterDecimals
          ).toString()}
          %
          <br />
          Percentage left for the seller:{' '}
          {(
            (BigInt(100) * precisionFactor - (total + nodeFee + treasuryFee)) /
            BigInt(10) ** minterDecimals
          ).toString()}
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
            disabled={!isAddress(resaleAddress) || approving}
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
      {contractData && (
        <FixedBottomNavigation
          forwardFunctions={[
            {
              label: `Switch to ${
                getBlockchainData(contractData?.blockchain)?.name
              }`,
              action: () => web3Switch(contractData?.blockchain),
              disabled: correctBlockchain(contractData?.blockchain as Hex),
              visible: !correctBlockchain(contractData?.blockchain as Hex)
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
