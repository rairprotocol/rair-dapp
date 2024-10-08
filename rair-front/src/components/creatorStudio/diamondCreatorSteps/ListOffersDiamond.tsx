import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DiamondOfferRow from './diamondOfferRow';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import {
  TAddDiamondOffer,
  TListOffers,
  TMarketplaceOfferConfigArrayItem,
  TParamsDiamondListOffers
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const ListOffers: React.FC<TListOffers> = ({
  contractData,
  setStepNumber,
  simpleMode,
  stepNumber,
  switchBlockchain,
  gotoNextStep,
  forceRefetch,
  fetchingData
}) => {
  const [offerList, setOfferList] = useState<
    TMarketplaceOfferConfigArrayItem[]
  >([]);
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [invalidItems, setInvalidItems] = useState<boolean>(true);

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain } = useWeb3Tx();
  const { getBlockchainData } = useServerSettings();

  const { primaryColor, textColor, primaryButtonColor, secondaryColor } =
    useAppSelector((store) => store.colors);
  const { collectionIndex } = useParams<TParamsDiamondListOffers>();

  useEffect(() => {
    let value = false;
    offerList.forEach((item) => {
      value = value || item.offerName.trim() === '';
    });
    setInvalidItems(value);
  }, [forceRerender, offerList]);

  useEffect(() => {
    setOfferList(contractData?.product?.offers || []);
  }, [contractData]);

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  const rerender = useCallback(() => {
    setForceRerender(() => !forceRerender);
  }, [setForceRerender, forceRerender]);

  const addOffer = () => {
    const aux: (TAddDiamondOffer | TMarketplaceOfferConfigArrayItem)[] = [
      ...offerList
    ];
    const startingToken =
      offerList.length === 0
        ? '0'
        : String(Number(offerList.at(-1)?.range?.at(1)) + 1);
    aux.push({
      offerName: '',
      range: [startingToken, startingToken],
      price: '0',
      tokensAllowed: '0',
      lockedTokens: '0'
    });
    setOfferList(aux as TMarketplaceOfferConfigArrayItem[]);
  };

  const deleter = (index: number) => {
    const aux = [...offerList];
    if (aux.length > 1 && index !== aux.length - 1) {
      aux[1].range[0] = '0';
    }
    aux.splice(index, 1);
    setOfferList(aux);
  };

  const createOffers = async () => {
    if (!contractData) {
      return;
    }
    reactSwal.fire({
      title: 'Creating ranges...',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(contractData.instance, 'createRangeBatch', [
        collectionIndex,
        offerList
          .filter((item: TMarketplaceOfferConfigArrayItem) => !item._id)
          .map((item) => {
            return {
              rangeLength: Number(item.range[1]) - Number(item.range[0]) + 1,
              tokensAllowed: item.tokensAllowed,
              lockedTokens: item.lockedTokens,
              price: item.price,
              name: item.offerName
            };
          })
      ])
    ) {
      forceRefetch();
      reactSwal.fire({
        title: 'Success!',
        html: 'The offer(s) have been created!',
        icon: 'success',
        showConfirmButton: true
      });
    }
  };

  return (
    <div className="row px-0 mx-0">
      {contractData ? (
        <>
          {offerList?.length !== 0 && (
            <div className="row w-100 text-start px-0 mx-0">
              {offerList.map((item, index, array) => {
                return (
                  <DiamondOfferRow
                    array={array}
                    deleter={() => deleter(index)}
                    key={index}
                    index={index}
                    {...item}
                    blockchainSymbol={
                      getBlockchainData(contractData?.blockchain)?.symbol
                    }
                    instance={contractData.instance}
                    rerender={rerender}
                    simpleMode={simpleMode}
                    maxCopies={Number(contractData?.product?.copies) - 1}
                    forceRefetch={forceRefetch}
                    fetchingData={fetchingData}
                  />
                );
              })}
            </div>
          )}
          <div className="col-12 mt-3 text-center">
            <button
              onClick={addOffer}
              style={{
                color: textColor,
                background: primaryButtonColor,
                borderColor: secondaryColor
              }}
              disabled={
                contractData === undefined ||
                offerList.length >= 12 ||
                Number(offerList?.at(-1)?.range[1]) >=
                  Number(contractData?.product?.copies) - 1
              }
              className={`btn rair-button rounded-rair px-4`}>
              Add new{' '}
              <FontAwesomeIcon
                icon={faPlusCircle}
              />
            </button>
          </div>
          <div
            className="col-12 mt-3 p-5 text-center rounded-rair"
            style={{
              border: `dashed 2px color-mix(in srgb, ${primaryColor}, #888888)`
            }}>
            First Token: {contractData?.product?.firstTokenIndex}, Last Token:{' '}
            {Number(contractData?.product?.firstTokenIndex) +
              contractData?.product?.copies -
              1}
            , Mintable Tokens Left:{' '}
            <abbr
              title={`${contractData.product.soldCopies} tokens have been minted!`}>
              {contractData?.product?.copies -
                contractData?.product?.soldCopies}
            </abbr>
          </div>
          <FixedBottomNavigation
            forwardFunctions={[
              {
                action: !correctBlockchain(contractData.blockchain)
                  ? switchBlockchain
                  : offerList[0]?._id
                    ? offerList.filter((item) => !item._id).length === 0
                      ? gotoNextStep
                      : createOffers
                    : createOffers,
                label: !correctBlockchain(contractData.blockchain)
                  ? `Switch to ${
                      getBlockchainData(contractData?.blockchain)?.name
                    }`
                  : offerList[0]?._id
                    ? offerList.filter((item) => !item._id).length === 0
                      ? 'Continue'
                      : 'Append Ranges'
                    : 'Create Ranges',
                disabled:
                  correctBlockchain(contractData.blockchain) &&
                  (!contractData.diamond ||
                    offerList.length === 0 ||
                    (Number(offerList.at(-1)?.range[1]) >
                      Number(contractData.product.copies) - 1 &&
                      offerList.at(-1)?._id === undefined) ||
                    invalidItems)
              }
            ]}
          />
        </>
      ) : (
        'Fetching data...'
      )}
    </div>
  );
};

const ContextWrapper = (props: TListOffers) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <ListOffers {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
