import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import MarketplaceOfferConfig from './MarketplaceOfferConfig';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { RootState } from '../../../ducks';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import chainData from '../../../utils/blockchainData';
import { metamaskCall } from '../../../utils/metamaskUtils';
import {
  TDiamondMinterMarketplace,
  TMarketplaceOfferConfigArrayItem
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const DiamondMinterMarketplace: React.FC<TDiamondMinterMarketplace> = ({
  contractData,
  setStepNumber,
  simpleMode,
  stepNumber,
  gotoNextStep,
  mintingRole,
  //handleMinterRole,
  forceRefetch
}) => {
  const { diamondMarketplaceInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const navigate = useNavigate();

  const [offerData, setOfferData] = useState<
    TMarketplaceOfferConfigArrayItem[]
  >([]);
  const [nodeFee, setNodeFee] = useState<number>(0);
  const [treasuryFee, setTreasuryFee] = useState<number>(0);
  const [treasuryAddress, setTreasuryAddress] = useState<string | undefined>(
    undefined
  );
  const [minterDecimals, setMinterDecimals] = useState<number>(0);
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [rerender, setRerender] = useState<boolean>(false);

  const getOfferData = useCallback(async () => {
    if (!contractData?.product.offers) {
      return;
    }

    setOfferData(
      contractData.product.offers.map((item) => {
        return {
          ...item
        };
      })
    );
  }, [contractData]);

  useEffect(() => {
    getOfferData();
  }, [getOfferData]);

  const getContractData = useCallback(async () => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    const nodeFeeData = await diamondMarketplaceInstance.getNodeFee();
    setNodeFee(Number(nodeFeeData.nodeFee.toString()));
    setMinterDecimals(nodeFeeData.decimals);
    const treasuryFeeData = await diamondMarketplaceInstance.getTreasuryFee();
    setTreasuryFee(Number(treasuryFeeData.treasuryFee.toString()));
    setTreasuryAddress(await diamondMarketplaceInstance.getTreasuryAddress());
  }, [diamondMarketplaceInstance]);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  const setCustomFees = async () => {
    setSendingData(true);
    Swal.fire({
      title: 'Publishing offers on the marketplace',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    const filteredOffers = offerData?.filter((item) => item.selected);
    if (
      await metamaskCall(
        diamondMarketplaceInstance?.addMintingOfferBatch(
          contractData?.contractAddress,
          filteredOffers?.map((item) => item.diamondRangeIndex),
          filteredOffers?.map((item) =>
            item.customSplits?.filter((split) => split.editable)
          ),
          filteredOffers?.map((item) => item.marketData.visible),
          process.env.REACT_APP_NODE_ADDRESS
        )
      )
    ) {
      Swal.fire({
        title: 'Success',
        html: 'Offer(s) added to the marketplace',
        icon: 'success',
        showConfirmButton: true
      });
    }
    setSendingData(false);
    getContractData();
  };

  const giveMinterRole = async () => {
    setSendingData(true);
    Swal.fire({
      title: 'Granting minter role',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await metamaskCall(
        contractData?.instance.grantRole(
          await contractData.instance.MINTER(),
          diamondMarketplaceInstance?.address
        )
      )
    ) {
      Swal.fire({
        title: 'Success',
        html: 'Now you can add offers into the marketplace',
        icon: 'success',
        showConfirmButton: true
      });
      forceRefetch();
      getContractData();
    }
    setSendingData(false);
  };

  return (
    <div className="row px-0 mx-0">
      {treasuryAddress !== undefined &&
        offerData &&
        offerData.map((item, index, array) => {
          return (
            <MarketplaceOfferConfig
              key={index}
              {...{
                array,
                index,
                nodeFee,
                minterDecimals,
                treasuryFee,
                treasuryAddress,
                simpleMode,
                rerender: () => setRerender(!rerender)
              }}
            />
          );
        })}
      {chainData && treasuryAddress && (
        <FixedBottomNavigation
          backwardFunction={() => {
            navigate(-1);
          }}
          forwardFunctions={[
            {
              label: mintingRole
                ? 'Put selected ranges up for sale!'
                : 'Approve the marketplace as a Minter!',
              action: mintingRole ? setCustomFees : giveMinterRole,
              disabled:
                sendingData ||
                mintingRole === undefined ||
                offerData?.filter((item) => item.selected === true).length === 0
            },
            {
              label: 'Continue',
              action: gotoNextStep,
              disabled: sendingData
            }
          ]}
        />
      )}
    </div>
  );
};

const ContextWrapper = (props: TDiamondMinterMarketplace) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <DiamondMinterMarketplace {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
