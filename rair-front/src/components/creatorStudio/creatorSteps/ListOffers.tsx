import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Contract, isAddress } from 'ethers';
import { Hex } from 'viem';

import OfferRow from './OfferRow';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { erc721Abi } from '../../../contracts';
import useContracts from '../../../hooks/useContracts';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import { validateInteger } from '../../../utils/metamaskUtils';
import {
  IListOffers,
  TOfferListItem,
  TParamsListOffers
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const ListOffers: React.FC<IListOffers> = ({
  mintingRole,
  // checkMarketRoles,
  contractData,
  setStepNumber,
  stepNumber,
  gotoNextStep
  // forceRefetch
}) => {
  const { correctBlockchain, web3Switch } = useWeb3Tx();

  const [offerList, setOfferList] = useState<TOfferListItem[]>([]);
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [, setInstance] = useState<Contract | undefined>();
  const [onMyChain, setOnMyChain] = useState<boolean>(
    correctBlockchain(contractData?.blockchain as Hex)
  );
  const [emptyNames, setEmptyNames] = useState<boolean>(true);
  const [validPrice, setValidPrice] = useState<boolean>(true);

  const { getBlockchainData } = useServerSettings();

  const { contractCreator } = useContracts();
  const { programmaticProvider } = useAppSelector((store) => store.web3);
  const { primaryColor } = useAppSelector((store) => store.colors);
  const { address } = useParams<TParamsListOffers>();

  useEffect(() => {
    setOfferList(
      contractData?.product?.offers
        ? contractData?.product?.offers.map((item) => {
            return {
              name: item.offerName,
              starts: item.range[0],
              ends: item.range[1],
              price: item.price,
              fixed: true
            };
          })
        : []
    );
  }, [contractData]);

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  useEffect(() => {
    let auxPrices: boolean = forceRerender && false;
    let auxNames = false;
    offerList.forEach((item) => {
      if (!item.fixed) {
        auxPrices =
          auxPrices || !validateInteger(+item.price) || +item.price <= 0;
        auxNames = auxNames || item.name === '';
      }
    });
    setEmptyNames(auxNames);
    setValidPrice(auxPrices);
  }, [offerList, forceRerender]);

  const rerender = useCallback(() => {
    setForceRerender(() => !forceRerender);
  }, [setForceRerender, forceRerender]);

  const addOffer = () => {
    const aux: TOfferListItem[] = [...offerList];
    const startingToken =
      offerList.length === 0 ? 0 : Number(offerList.at(-1)?.ends) + 1;
    aux.push({
      name: '',
      starts: String(startingToken),
      ends: String(startingToken),
      price: '100'
    });
    setOfferList(aux);
  };

  const deleter = (index: number) => {
    const aux = [...offerList];
    if (aux.length > 1 && index !== aux.length - 1) {
      aux[1].starts = '0';
    }
    aux.splice(index, 1);
    setOfferList(aux);
  };

  useEffect(() => {
    if (onMyChain && isAddress(address) && contractCreator) {
      const createdInstance = contractCreator(address as Hex, erc721Abi);
      setInstance(createdInstance);
    }
  }, [address, onMyChain, contractCreator]);

  const validateTokenIndexes = () => {
    if (contractData && offerList.length > 0) {
      const copies = BigInt(contractData.product.copies) - BigInt(1);
      let allOffersAreCorrect = true;
      for (const item of offerList) {
        if (!allOffersAreCorrect) {
          return false;
        }
        allOffersAreCorrect =
          allOffersAreCorrect &&
          validateInteger(item.ends) &&
          validateInteger(item.starts) &&
          BigInt(item.ends) < BigInt(copies) &&
          BigInt(item.starts) < BigInt(copies) &&
          BigInt(item.starts) < BigInt(item.ends);
      }
      return allOffersAreCorrect;
    }
    return false;
  };

  useEffect(() => {
    setOnMyChain(
      !!contractData && correctBlockchain(contractData.blockchain as Hex)
    );
  }, [contractData, programmaticProvider, correctBlockchain]);

  return (
    <div className="row px-0 mx-0">
      {contractData ? (
        <>
          {offerList?.length !== 0 && (
            <table className="col-12 text-start">
              <thead>
                <tr>
                  <th className="px-1" style={{ width: '5vw' }} />
                  <th>Item name</th>
                  <th style={{ width: '10vw' }}>Starts</th>
                  <th style={{ width: '10vw' }}>Ends</th>
                  <th style={{ width: '20vw' }}>Price for each</th>
                  <th />
                </tr>
              </thead>
              <tbody style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
                {offerList.map((item, index, array) => {
                  return (
                    <OfferRow
                      array={array}
                      deleter={() => deleter(index)}
                      key={index}
                      index={index}
                      {...item}
                      blockchainSymbol={
                        getBlockchainData(contractData?.blockchain)?.symbol
                      }
                      rerender={rerender}
                      maxCopies={Number(contractData?.product?.copies) - 1}
                    />
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="col-12 mt-3 text-center">
            <div className="border-stimorol rounded-rair">
              <button
                onClick={addOffer}
                disabled={offerList.length >= 12}
                className={`btn btn-${primaryColor} rounded-rair px-4`}>
                Add new <FontAwesomeIcon icon={faPlusCircle} />
              </button>
            </div>
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
            {contractData?.product?.copies - contractData?.product?.soldCopies}
          </div>
          <FixedBottomNavigation
            forwardFunctions={[
              !onMyChain
                ? {
                    action: () => web3Switch(contractData?.blockchain as Hex),
                    label: `Switch to ${
                      getBlockchainData(contractData?.blockchain)?.name
                    }`
                  }
                : mintingRole === true
                  ? {
                      action: undefined,
                      label: offerList[0]?.fixed
                        ? 'Append to offer'
                        : 'Create new offers',
                      disabled:
                        offerList.filter((item) => item.fixed !== true)
                          .length === 0 ||
                        offerList.length === 0 ||
                        !validateTokenIndexes() ||
                        validPrice ||
                        emptyNames
                    }
                  : {
                      action: undefined,
                      label: 'Connect to Minter Marketplace'
                    },
              {
                label: 'Continue',
                action: gotoNextStep
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

const ContextWrapper = (props: IListOffers) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <ListOffers {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
