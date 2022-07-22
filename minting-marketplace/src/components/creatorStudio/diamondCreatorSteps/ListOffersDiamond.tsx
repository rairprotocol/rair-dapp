import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import FixedBottomNavigation from '../FixedBottomNavigation';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import chainData from '../../../utils/blockchainData';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { metamaskCall } from '../../../utils/metamaskUtils';
import DiamondOfferRow from './diamondOfferRow';
import {
  TMarketplaceOfferConfigArrayItem,
  TListOffers,
  TParamsDiamondListOffers,
  TAddDiamondOffer
} from '../creatorStudio.types';
import { RootState } from '../../../ducks';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';

const ListOffers: React.FC<TListOffers> = ({
  contractData,
  setStepNumber,
  simpleMode,
  stepNumber,
  switchBlockchain,
  gotoNextStep,
  forceRefetch
}) => {
  const [offerList, setOfferList] = useState<
    TMarketplaceOfferConfigArrayItem[]
  >([]);
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [onMyChain, setOnMyChain] = useState<boolean>();
  const [invalidItems, setInvalidItems] = useState<boolean>(true);

  const { programmaticProvider, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const { collectionIndex } = useParams<TParamsDiamondListOffers>();

  useEffect(() => {
    let value = false;
    offerList.forEach((item) => {
      value = value || item.offerName.trim() === '' || +item.price <= 0;
    });
    setInvalidItems(value);
  }, [forceRerender, offerList]);

  useEffect(() => {
    setOfferList(
      contractData?.product?.offers ? contractData?.product?.offers : []
    );
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
  const navigate = useNavigate();

  const createOffers = async () => {
    Swal.fire({
      title: 'Creating offer...',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await metamaskCall(
        contractData?.instance.createRangeBatch(
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
        )
      )
    ) {
      forceRefetch();
      Swal.fire({
        title: 'Success!',
        html: 'The offer(s) have been created!',
        icon: 'success',
        showConfirmButton: true
      });
    }
  };

  useEffect(() => {
    setOnMyChain(
      contractData &&
        (window.ethereum
          ? chainData[contractData?.blockchain]?.chainId === currentChain
          : chainData[contractData?.blockchain]?.chainId === currentChain)
    );
  }, [contractData, programmaticProvider, currentChain]);

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
                      chainData[contractData?.blockchain]?.symbol
                    }
                    instance={contractData.instance}
                    rerender={rerender}
                    simpleMode={simpleMode}
                    maxCopies={Number(contractData?.product?.copies) - 1}
                  />
                );
              })}
            </div>
          )}
          <div className="col-12 mt-3 text-center">
            <div className="border-stimorol rounded-rair">
              <button
                onClick={addOffer}
                disabled={
                  contractData === undefined ||
                  offerList.length >= 12 ||
                  Number(offerList?.at(-1)?.range[1]) >=
                    Number(contractData?.product?.copies) - 1
                }
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
          <div
            className="col-12 mt-3 p-5 text-center rounded-rair"
            style={{ border: 'dashed 2px var(--charcoal-80)' }}>
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
          {chainData && (
            <FixedBottomNavigation
              backwardFunction={() => {
                navigate(-1);
              }}
              forwardFunctions={[
                {
                  action: !onMyChain
                    ? switchBlockchain
                    : offerList[0]?._id
                    ? offerList.filter((item) => !item._id).length === 0
                      ? gotoNextStep
                      : createOffers
                    : createOffers,
                  label: !onMyChain
                    ? `Switch to ${chainData[contractData?.blockchain]?.name}`
                    : offerList[0]?._id
                    ? offerList.filter((item) => !item._id).length === 0
                      ? 'Continue'
                      : 'Append Ranges'
                    : 'Create Ranges',
                  disabled:
                    onMyChain &&
                    (!contractData.diamond ||
                      offerList.length === 0 ||
                      (Number(offerList.at(-1)?.range[1]) >
                        Number(contractData.product.copies) - 1 &&
                        offerList.at(-1)?._id === undefined) ||
                      invalidItems)
                }
              ]}
            />
          )}
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
