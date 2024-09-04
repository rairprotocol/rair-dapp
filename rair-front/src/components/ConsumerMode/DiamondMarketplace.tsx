import React, { useCallback, useEffect, useState } from 'react';
import { Provider, useStore } from 'react-redux';
import { faGem, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatEther, ZeroAddress } from 'ethers';

import {
  IBatchTokenSelector,
  ITokenSelector,
  TAux,
  TOffersArrayItem
} from './consumerMode.types';

import { diamondFactoryAbi } from '../../contracts';
import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import InputField from '../common/InputField';
import BuyTokenModalContent from '../marketplace/BuyTokenModalContent';

const BatchTokenSelector: React.FC<IBatchTokenSelector> = ({
  batchMint,
  max
}) => {
  const [batchArray, setBatchArray] = useState<TAux[]>([]);
  const [rerender, setRerender] = useState<boolean>(false);

  const { primaryButtonColor, textColor, secondaryButtonColor } =
    useAppSelector((store) => store.colors);

  const addRecipient = () => {
    if (batchArray.length >= +max) {
      return;
    }
    const aux = [...batchArray];
    aux.push({
      recipient: '',
      tokenIndex: 0
    });
    setBatchArray(aux);
  };

  const remove = (index: number) => {
    const aux = [...batchArray];
    aux.splice(index, 1);
    setBatchArray(aux);
  };

  return (
    <details>
      <summary>Batch Minting</summary>
      {batchArray.map((item, index) => {
        return (
          <div className="col-12 row px-0 mx-0" key={Math.random() * 1_000_000}>
            <div className="col-12 col-md-3">
              <InputField
                customClass="form-control"
                getter={batchArray[index].tokenIndex}
                setter={(value) => {
                  batchArray[index].tokenIndex = value;
                  setRerender(!rerender);
                }}
                placeholder="Token"
              />
            </div>
            <div className="col-12 col-md-8">
              <InputField
                customClass="form-control"
                getter={batchArray[index].recipient}
                setter={(value) => {
                  batchArray[index].recipient = value;
                  setRerender(!rerender);
                }}
                placeholder="Recipient"
              />
            </div>
            <button
              onClick={() => remove(index)}
              className="col-12 btn btn-danger col-md-1">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        );
      })}
      <button
        className="btn rair-button"
        style={{
          background: secondaryButtonColor,
          color: textColor
        }}
        disabled={batchArray.length >= +max}
        onClick={addRecipient}>
        Add
      </button>
      <button
        className="btn rair-button"
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        onClick={() =>
          batchMint(
            batchArray.map((item) => item.tokenIndex),
            batchArray.map((item) => item.recipient)
          )
        }>
        Batch Mint
      </button>
    </details>
  );
};

const TokenSelector: React.FC<ITokenSelector> = ({ buyCall, max, min }) => {
  const [tokenId, setTokenId] = useState<string>(min);

  const { textColor, secondaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

  return (
    <details>
      <summary>
        <small>Buy specific token</small>
      </summary>
      <InputField
        customClass="form-control"
        getter={tokenId}
        setter={setTokenId}
        placeholder="Token Identifier"
        type="number"
        min={min}
        max={max}
        label="Token #"
      />
      <br />
      <button
        onClick={() => {
          buyCall(tokenId);
        }}
        style={{
          background: secondaryButtonColor,
          color: textColor
        }}
        className="btn rair-button">
        Buy token #{tokenId}
      </button>
    </details>
  );
};

const DiamondMarketplace = () => {
  const [loadingData, setLoadingData] = useState<Boolean>(true);
  const [offersArray, setOffersArray] = useState<TOffersArrayItem[]>([]);
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);
  const [treasuryAddress, setTreasuryAddress] = useState<string>();

  const { connectedChain } = useAppSelector((store) => store.web3);
  const { diamondMarketplaceInstance, contractCreator } = useContracts();
  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const store = useStore();

  const { getBlockchainData } = useServerSettings();

  const {
    primaryColor,
    secondaryColor,
    textColor,
    secondaryButtonColor,
    primaryButtonColor
  } = useAppSelector((store) => store.colors);

  const fetchDiamondData = useCallback(async () => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    setTreasuryAddress(await diamondMarketplaceInstance.getTreasuryAddress());
    const offerCount = Number(
      (await diamondMarketplaceInstance.getTotalOfferCount()).toString()
    );
    const offerData: TOffersArrayItem[] = [];
    for (let i = 0; i < offerCount; i++) {
      const singleOfferData = await diamondMarketplaceInstance.getOfferInfo(i);
      offerData.push({
        offerIndex: i.toString(),
        contractAddress: singleOfferData.mintOffer.erc721Address,
        rangeIndex: singleOfferData.mintOffer.rangeIndex.toString(),
        visible: singleOfferData.mintOffer.visible,
        startingToken: singleOfferData.rangeData.rangeStart.toString(),
        endingToken: singleOfferData.rangeData.rangeEnd.toString(),
        name: singleOfferData.rangeData.rangeName,
        price: singleOfferData.rangeData.rangePrice,
        tokensAllowed: singleOfferData.rangeData.tokensAllowed.toString(),
        mintableTokens: singleOfferData.rangeData.mintableTokens.toString(),
        lockedTokens: singleOfferData.rangeData.lockedTokens.toString(),
        productIndex: singleOfferData.productIndex.toString()
      });
    }
    setOffersArray(offerData);
    setLoadingData(false);
  }, [diamondMarketplaceInstance]);

  useEffect(() => {
    fetchDiamondData();
  }, [fetchDiamondData]);

  const mintTokenCall = async (
    offerIndex: string,
    nextToken: string,
    price: bigint
  ) => {
    //setTransactionInProgress(true);
    reactSwal.fire({
      title: `Buying token #${nextToken}!`,
      html: 'Awaiting confirmation...',
      icon: 'info',
      showConfirmButton: false
    });
    if (!diamondMarketplaceInstance) {
      return;
    }
    reactSwal.fire({
      title: `Buying token #${nextToken}!`,
      html: 'Sending transaction...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(diamondMarketplaceInstance, 'buyMintingOffer', [
        offerIndex,
        nextToken,
        {
          value: price.toString()
        }
      ])
    ) {
      reactSwal.fire({
        title: 'Success',
        html: 'Token bought',
        icon: 'success',
        showConfirmButton: true
      });
    }
    setTransactionInProgress(false);
  };

  const batchMint = async (
    offerIndex: string,
    tokens: number[],
    addresses: string[],
    price: bigint
  ) => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    setTransactionInProgress(true);
    reactSwal.fire({
      title: `Buying ${tokens.length} tokens!`,
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(diamondMarketplaceInstance, 'buyMintingOfferBatch', [
        offerIndex,
        tokens,
        addresses,
        {
          value: BigInt(price.toString()) * BigInt(tokens.length)
        }
      ])
    ) {
      reactSwal.fire({
        title: 'Success',
        html: `${addresses.length} tokens bought`,
        icon: 'success',
        showConfirmButton: true
      });
    }
    setTransactionInProgress(false);
  };

  return (
    <div className="row w-100">
      <div className="col-12 text-center">
        <h1>
          <FontAwesomeIcon icon={faGem} />
        </h1>
        <h5> Diamond Marketplace </h5>
        {loadingData
          ? 'Loading data, please wait...'
          : `${offersArray.length} offers found.`}
      </div>
      {treasuryAddress === ZeroAddress && (
        <button
          className="btn rair-button"
          style={{
            background: primaryButtonColor,
            color: textColor
          }}
          onClick={async () => {
            if (!diamondMarketplaceInstance) {
              return;
            }
            await web3TxHandler(
              diamondMarketplaceInstance,
              'updateTreasuryAddress',
              ['0x3fD4268B03cce553f180E77dfC14fde00271F9B7']
            );
          }}>
          Set Treasury Address
        </button>
      )}
      {offersArray.map((offer, index) => {
        return (
          <div
            style={{
              position: 'relative'
            }}
            key={index}
            className="col-12 p-2 col-md-6 my-3 rounded-rair">
            <abbr
              title={'Offer Index on the marketplace'}
              style={{ position: 'absolute', top: 0, left: 0 }}>
              #{index}
            </abbr>
            <small>
              {' '}
              @<abbr title="Contract address">{offer.contractAddress}</abbr>:
              <abbr title="Product index">{offer.productIndex}</abbr>{' '}
            </small>
            <br />
            Range #{offer.rangeIndex}
            <h3>{offer.name}</h3>
            <h5 style={{ display: 'inline' }}>
              <abbr
                title={`From a total of ${offer.mintableTokens} tokens still available`}>
                {offer.tokensAllowed}
              </abbr>
            </h5>{' '}
            tokens available for{' '}
            <h5 style={{ display: 'inline' }}>
              {formatEther(offer.price)}{' '}
              {connectedChain && getBlockchainData(connectedChain)?.symbol}
            </h5>
            <br />
            <h5 className="w-100 text-center px-5">
              <div className="float-start">{offer.startingToken}...</div>
              <progress
                max={
                  Number(offer.endingToken) - Number(offer.startingToken) + 1
                }
                value={offer.tokensAllowed}
              />
              <div className="float-end">...{offer.endingToken}</div>
            </h5>
            <button
              disabled={transactionInProgress || !offer.visible}
              onClick={async () => {
                const instance = contractCreator?.(
                  offer.contractAddress,
                  diamondFactoryAbi
                );
                const nextToken = await instance?.getNextSequentialIndex(
                  offer.productIndex,
                  offer.startingToken,
                  offer.endingToken
                );
                await mintTokenCall(offer.offerIndex, nextToken, offer.price);
              }}
              style={{
                color: textColor,
                background: offer.visible ? primaryButtonColor : 'red'
              }}
              className={'btn my-2 py-0 rair-button'}>
              {offer.visible
                ? 'Buy the first available token'
                : 'Not for sale!'}
            </button>
            {false && offer.visible && (
              <TokenSelector
                min={offer.startingToken}
                max={offer.endingToken}
                buyCall={async (tokenIndex) => {
                  await mintTokenCall(
                    offer.offerIndex,
                    tokenIndex,
                    offer.price
                  );
                }}
              />
            )}
            {false && offer.visible && (
              <BatchTokenSelector
                max={offer.tokensAllowed}
                batchMint={(tokens: number[], addresses: string[]) =>
                  batchMint(offer.offerIndex, tokens, addresses, offer.price)
                }
              />
            )}
            <br />
            {offer.visible && (
              <button
                id={`button_${index}`}
                onClick={async () => {
                  reactSwal.fire({
                    html: (
                      <Provider store={store}>
                        <BuyTokenModalContent
                          diamonds={true}
                          buyTokenFunction={mintTokenCall}
                          buyTokenBatchFunction={batchMint}
                          start={offer.startingToken}
                          end={offer.endingToken}
                          blockchain={connectedChain}
                          price={offer.price}
                          offerName={offer.name}
                          offerIndex={offer.offerIndex}
                        />
                      </Provider>
                    ),
                    showConfirmButton: false,
                    width: '70vw',
                    customClass: {
                      popup: `bg-${primaryColor}`,
                      htmlContainer: `text-${secondaryColor}`
                    }
                  });
                }}
                style={{
                  background: secondaryButtonColor,
                  color: textColor
                }}
                className="btn rair-button py-0">
                More options
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DiamondMarketplace;
