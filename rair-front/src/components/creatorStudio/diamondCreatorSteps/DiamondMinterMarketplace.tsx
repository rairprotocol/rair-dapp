import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber } from 'ethers';

import MarketplaceOfferConfig from './MarketplaceOfferConfig';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { RootState } from '../../../ducks';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import chainData from '../../../utils/blockchainData';
import {
  TDiamondMinterMarketplace,
  TMarketplaceOfferConfigArrayItem
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const DiamondMinterMarketplace: React.FC<TDiamondMinterMarketplace> = ({
  MINTERHash,
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
  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const [offerData, setOfferData] = useState<
    TMarketplaceOfferConfigArrayItem[]
  >([]);
  const [nodeFee, setNodeFee] = useState<BigNumber>(BigNumber.from(0));
  const [treasuryFee, setTreasuryFee] = useState<BigNumber>(BigNumber.from(0));
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
    if (nodeFee.eq(0) && minterDecimals === 0) {
      const nodeFeeData = await web3TxHandler(
        diamondMarketplaceInstance,
        'getNodeFee'
      );
      if (nodeFeeData) {
        setNodeFee(nodeFeeData.nodeFee);
        setMinterDecimals(nodeFeeData.decimals);
      }
    }
    if (treasuryFee.eq(0)) {
      const treasuryFeeData = await web3TxHandler(
        diamondMarketplaceInstance,
        'getTreasuryFee'
      );
      if (treasuryFeeData) {
        setTreasuryFee(treasuryFeeData.treasuryFee);
      }
    }
    const treasuryAddress = await web3TxHandler(
      diamondMarketplaceInstance,
      'getTreasuryAddress'
    );
    if (treasuryAddress) {
      setTreasuryAddress(treasuryAddress);
    }
  }, [
    diamondMarketplaceInstance,
    minterDecimals,
    nodeFee,
    treasuryFee,
    web3TxHandler
  ]);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  const setCustomFees = async () => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    setSendingData(true);
    reactSwal.fire({
      title: 'Publishing offers on the marketplace',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    const filteredOffers = offerData?.filter((item) => item.selected);
    if (
      await web3TxHandler(diamondMarketplaceInstance, 'addMintingOfferBatch', [
        contractData?.contractAddress,
        filteredOffers?.map((item) => item.diamondRangeIndex),
        filteredOffers?.map(
          (item) => item.customSplits?.filter((split) => split.editable)
        ),
        filteredOffers?.map((item) => item.marketData.visible),
        import.meta.env.VITE_NODE_ADDRESS
      ])
    ) {
      reactSwal.fire({
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
    if (!contractData?.instance) {
      return;
    }
    setSendingData(true);
    reactSwal.fire({
      title: 'Granting minter role',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      MINTERHash &&
      (await web3TxHandler(contractData.instance, 'grantRole', [
        MINTERHash,
        diamondMarketplaceInstance?.address
      ]))
    ) {
      reactSwal.fire({
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
                enabled: !contractData?.instance,
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
