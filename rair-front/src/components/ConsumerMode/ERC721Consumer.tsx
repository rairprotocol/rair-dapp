import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { utils } from 'ethers';

import BatchMinting from './BatchMinting';
import {
  IERC721ManagerConsumer,
  IRange,
  TBalanceInfo,
  TBatchMintingItem,
  TRangeInfo
} from './consumerMode.types';

import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import blockchainData from '../../utils/blockchainData';

const Range: React.FC<IRange> = ({
  tokenInstance,
  productIndex,
  offerIndex,
  rangeIndex
}) => {
  const [next, setNext] = useState<string>();
  const [specificIndex, setSpecificIndex] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState('');
  const [allowed, setAllowed] = useState<string>('');

  const { minterInstance, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const refreshData = useCallback(async () => {
    const data = await minterInstance?.getOfferRangeInfo(
      offerIndex,
      rangeIndex
    );
    setName(data.name);
    setPrice(data.price.toString());
    setStart(data.tokenStart.toString());
    setEnd(data.tokenEnd.toString());
    setAllowed(data.tokensAllowed.toString());
    try {
      setNext(
        (
          await tokenInstance?.getNextSequentialIndex(
            productIndex,
            data.tokenStart,
            data.tokenEnd
          )
        ).toString()
      );
    } catch (e) {
      console.error(e);
    }
  }, [minterInstance, offerIndex, rangeIndex, productIndex, tokenInstance]);

  useEffect(() => {
    if (tokenInstance) {
      tokenInstance.on(
        'Transfer(address,address,uint256)',
        async (/*from, to, tokenId*/) => {
          refreshData();
        }
      );
    }
    refreshData();
  }, [refreshData, tokenInstance]);

  const batchMint = async (data: TBatchMintingItem[]) => {
    if (!minterInstance) {
      return;
    }
    const addresses = data.map((i: TBatchMintingItem) => i.address);
    const tokens = data.map((i: TBatchMintingItem) => i.token);
    reactSwal.fire({
      title: 'Preparing transaction',
      html: 'Please wait',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(minterInstance, 'buyTokenBatch', [
        offerIndex,
        rangeIndex,
        tokens,
        addresses,
        {
          value: Number(price) * tokens.length
        }
      ])
    ) {
      reactSwal.fire('Success', 'Minted all tokens', 'success');
    }
  };

  return (
    <div style={{ position: 'relative' }} className="w-100 my-2">
      <b>{name}</b>: {allowed} tokens at {price} each!
      <br />
      <div style={{ position: 'absolute', left: 0 }}>{start}...</div>
      <div style={{ position: 'absolute', right: 0 }}>...{end}</div>
      <button
        onClick={async () => {
          if (!minterInstance) {
            return;
          }
          reactSwal.fire({
            title: 'Preparing transaction',
            html: 'Please wait',
            icon: 'info',
            showConfirmButton: false
          });
          if (
            await web3TxHandler(
              minterInstance,
              'buyToken',
              [
                offerIndex,
                rangeIndex,
                next,
                {
                  value: price.toString()
                }
              ],
              {
                intendedBlockchain: currentChain as BlockchainType,
                failureMessage:
                  'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
              }
            )
          ) {
            reactSwal.fire('Success', 'Token Minted!', 'success');
          }
        }}
        className="btn btn-success py-0">
        Buy token #{next} for{' '}
        {utils.formatEther(price === '' ? 0 : price)?.toString()}{' '}
        {currentChain && blockchainData[currentChain]?.symbol}!
      </button>
      <button
        onClick={() => {
          reactSwal.fire({
            html: (
              <BatchMinting
                name={name}
                start={start}
                end={end}
                price={price}
                batchMint={batchMint}
              />
            ),
            width: '60vw',
            showConfirmButton: false
          });
        }}
        className="btn py-0 btn-secondary">
        Batch Minting
      </button>
      {start && allowed && end && (
        <progress
          className="w-100"
          value={Number(end) - Number(start) + 1 - Number(allowed)}
          max={end}
        />
      )}
      {allowed} tokens left!
      {allowed && Number(allowed) !== 0 && (
        <>
          <small>
            <details>
              <summary>Mint a specific token!</summary>
              <input
                type="number"
                value={specificIndex}
                onChange={(e) => setSpecificIndex(+e.target.value)}
              />
              <br />
              <button
                disabled={Number(next) > specificIndex}
                onClick={async () => {
                  try {
                    await minterInstance?.buyToken(
                      offerIndex,
                      rangeIndex,
                      specificIndex,
                      {
                        value: price
                      }
                    );
                  } catch (err: any) {
                    reactSwal.fire('Error', err?.data?.message, 'error');
                  }
                }}
                className="btn py-0 btn-warning">
                Buy token #{specificIndex} for{' '}
                {utils.formatEther(price === '' ? 0 : price).toString()}{' '}
                {currentChain && blockchainData[currentChain]?.symbol}!
              </button>
            </details>
          </small>
        </>
      )}
      <br />
      <hr className="w-100" />
    </div>
  );
};

const ERC721Manager: React.FC<IERC721ManagerConsumer> = ({
  offerInfo,
  index,
  width = 6
}) => {
  const [balance, setBalance] = useState<TBalanceInfo[]>();
  const [productName, setProductName] = useState<string>();
  const [contractName, setContractName] = useState<string>();
  const [rangeInfo, setRangeInfo] = useState<TRangeInfo[]>([]);
  const [refetchingFlag, setRefetchingFlag] = useState<boolean>(false);

  const { minterInstance, currentUserAddress } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  const refreshData = useCallback(async () => {
    setRefetchingFlag(true);
    const balances: TBalanceInfo[] = [];
    const tokensOwned = (
      await offerInfo.instance?.balanceOf(currentUserAddress)
    ).toString();
    setProductName(
      (await offerInfo.instance?.getProduct(offerInfo.productIndex)).productName
    );
    setContractName(await offerInfo.instance?.name());
    const ranges: TRangeInfo[] = [];
    for await (const rangeIndex of [
      // eslint-disable-next-line
      ...Array.apply<null, any, unknown[]>(null, {
        length: offerInfo.ranges
      }).keys()
    ]) {
      const data = await minterInstance?.getOfferRangeInfo(index, rangeIndex);
      ranges.push({
        name: data.name,
        price: data.price.toString(),
        start: data.tokenStart.toString(),
        end: data.tokenEnd.toString(),
        allowed: data.tokensAllowed.toString()
      });
    }
    setRangeInfo(ranges);
    if (tokensOwned > 0) {
      for await (const index of [
        // eslint-disable-next-line
        ...Array.apply<null, any, unknown[]>(null, {
          length: tokensOwned
        }).keys()
      ]) {
        const token = (
          await offerInfo.instance?.tokenOfOwnerByIndex(
            currentUserAddress,
            index
          )
        ).toString();
        if (
          (await offerInfo.instance?.tokenToProduct(token)).toString() ===
          offerInfo.productIndex
        ) {
          balances.push({
            token,
            internalIndex: (
              await offerInfo.instance?.tokenToProductIndex(token)
            ).toString()
          });
        }
      }
    }
    setBalance(balances);
    setRefetchingFlag(false);
  }, [
    currentUserAddress,
    index,
    minterInstance,
    offerInfo.instance,
    offerInfo.productIndex,
    offerInfo.ranges
  ]);

  useEffect(() => {
    refreshData();
  }, [offerInfo, currentUserAddress, refreshData]);

  return (
    <details
      style={{ position: 'relative' }}
      className={`col-12 col-md-${width} py-4 border border-white rounded`}>
      <summary>
        <div style={{ position: 'absolute', top: 0, right: '2vh' }}>
          #{index + 1}
          <br />
        </div>
        <h5 className="d-inline-block">{productName}</h5>
        <Link
          to={`/rair/${offerInfo.contractAddress}/${offerInfo.productIndex}`}
          style={{ position: 'absolute', top: 0, left: '5vh' }}>
          @{contractName}
        </Link>
      </summary>
      <button
        onClick={refreshData}
        disabled={refetchingFlag}
        style={{ position: 'absolute', left: 0, top: 0, color: 'inherit' }}
        className="px-2 btn">
        {refetchingFlag ? '...' : <FontAwesomeIcon icon={faRedo} />}
      </button>
      <small>
        Contract Address: <b>{offerInfo.contractAddress}</b>
      </small>
      <br />
      <small>Product Index: {offerInfo.productIndex}</small>
      <br />
      <br />
      {rangeInfo.map((item, rangeIndex) => {
        return (
          <Range
            key={rangeIndex}
            tokenInstance={offerInfo.instance}
            productIndex={offerInfo.productIndex}
            rangeIndex={rangeIndex}
            offerIndex={index}
          />
        );
      })}
      <hr className="w-75 mx-auto" />
      {balance && (
        <>
          You own {balance.length} tokens from this collection
          <br />
          {balance.map((item, index) => (
            <details key={index} className="w-100">
              <summary>
                <h5 className="d-inline-block">{item.internalIndex}</h5>
              </summary>
              {offerInfo.contractAddress}:{item.token}
              <div className="row px-0 mx-0">
                <div className="col-9">
                  <input
                    disabled
                    type="number"
                    className="form-control"
                    placeholder="Price"
                  />
                </div>
                <button disabled className="btn btn-primary col-3">
                  Resell
                </button>
              </div>
              <hr className="w-100" />
            </details>
          ))}
        </>
      )}
      <br />
      <hr className="w-50 mx-auto" />
    </details>
  );
};

export default ERC721Manager;
