import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  faArrowUp,
  faLock,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { utils } from 'ethers';

import {
  IExistingLock,
  IProductManager,
  IRangeManager,
  IRangesType
} from './creatorMode.types';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';

const RangeManager: React.FC<IRangeManager> = ({
  disabled,
  index,
  array,
  deleter,
  sync,
  hardLimit,
  locker,
  productIndex,
  updater,
  offerIndex
}) => {
  const [endingRange, setEndingRange] = useState<number>(
    disabled
      ? array[index].endingToken
      : index === 0
        ? 0
        : Number(array[index - 1].endingToken) + 1
  );
  const [rangeName, setRangeName] = useState<string>(array[index].name);
  const [rangePrice, setRangePrice] = useState<string>(array[index].price);
  const syncOutside = useCallback(sync, [sync]);
  const rangeInit = index === 0 ? 0 : Number(array[index - 1].endingToken) + 1;
  const [locked, setLocked] = useState<number>(0);
  const { primaryButtonColor, textColor, secondaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  useEffect(() => {
    const aux = array[index].endingToken !== endingRange;
    array[index].endingToken = endingRange;
    if (aux) {
      syncOutside();
    }
  }, [endingRange, array, index, syncOutside]);

  useEffect(() => {
    const aux = array[index].name !== rangeName;
    array[index].name = rangeName;
    if (aux) {
      syncOutside();
    }
  }, [rangeName, array, index, syncOutside]);

  useEffect(() => {
    const aux = array[index].price !== rangePrice;
    array[index].price = rangePrice;
    if (aux) {
      syncOutside();
    }
  }, [rangePrice, array, index, syncOutside]);

  const prevLastIndex =
    index === 0 ? 0 : Number(array[index - 1].endingToken + 1);

  return (
    <>
      <tr>
        <th>
          {!disabled ? (
            <button
              onClick={() => deleter(index)}
              className="btn btn-danger h-50">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          ) : (
            ''
          )}
        </th>
        <th>#{index + 1}</th>
        <th>
          <input
            className="form-control"
            value={rangeName}
            onChange={(e) => setRangeName(e.target.value)}
          />
        </th>
        <th>
          <input
            className="form-control"
            type="number"
            value={prevLastIndex}
            disabled
          />
        </th>
        <th>
          <input
            style={
              (index === 0 ? 0 : array[index - 1].endingToken) > endingRange ||
              endingRange > hardLimit
                ? {
                    backgroundColor: 'red',
                    color: 'white'
                  }
                : {}
            }
            disabled={disabled}
            className="form-control"
            type="number"
            min={index === 0 ? 0 : Number(array[index - 1].endingToken) + 1}
            max={hardLimit}
            value={endingRange}
            onChange={(e) => setEndingRange(Number(e.target.value))}
          />
        </th>
        <th>
          <input
            type="number"
            className="form-control"
            value={rangePrice}
            onChange={(e) => setRangePrice(e.target.value)}
          />
        </th>
        <th>
          <button
            disabled={!disabled || !rangePrice || !rangeName}
            onClick={() =>
              updater(
                offerIndex,
                index,
                prevLastIndex,
                endingRange,
                rangePrice,
                rangeName
              )
            }
            style={{
              background: primaryButtonColor,
              color: textColor
            }}
            className="btn rair-button h-50">
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
        </th>
        <th>
          <input
            className="form-control"
            type="number"
            value={locked}
            onChange={(e) => setLocked(+e.target.value)}
          />
        </th>
        <th>
          <button
            disabled={locked <= 0}
            onClick={() => locker(productIndex, rangeInit, endingRange, locked)}
            style={{
              background: secondaryButtonColor,
              color: textColor
            }}
            className="btn rair-button h-50">
            <FontAwesomeIcon icon={faLock} />
          </button>
        </th>
      </tr>
      <tr>
        <th />
        <th />
        <th />
        <th />
        <th />
        <th>
          <small>
            {utils.formatEther(rangePrice === '' ? 0 : rangePrice).toString()}{' '}
            {'ETH'}
          </small>
        </th>
        <th />
        <th />
      </tr>
    </>
  );
};

const ProductManager: React.FC<IProductManager> = ({
  productIndex,
  productInfo,
  tokenInstance,
  tokenAddress
}) => {
  const { minterInstance } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );
  const { textColor, secondaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [ranges, setRanges] = useState<IRangesType[]>([]);
  const [, /*locks*/ setLocks] = useState<IExistingLock[]>([]);
  const [forceSync, setForceSync] = useState<boolean>(false);
  const [, /*offerIndex*/ setOfferIndex] = useState<string>('');

  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const deleter = (index) => {
    const aux = [...ranges];
    aux.splice(index, 1);
    setRanges(aux);
  };

  const locker = async (
    productIndex: number,
    startingToken: number,
    endingToken: number,
    lockedTokens: number
  ) => {
    if (!tokenInstance) {
      return;
    }
    reactSwal.fire({
      title: 'Locking tokens',
      html: 'Please wait',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(tokenInstance, 'createRangeLock', [
        productIndex,
        startingToken,
        endingToken,
        lockedTokens
      ])
    ) {
      reactSwal.fire('Success', 'Tokens locked', 'success');
    }
  };

  const refresher = useCallback(async () => {
    try {
      // Marketplace Ranges
      const offerInfo = await minterInstance?.contractToOfferRange(
        tokenInstance?.address,
        productIndex
      );
      const offerIndex = offerInfo?.toString();
      if (offerIndex) {
        setOfferIndex(offerIndex);
      }
      const offerData = await minterInstance?.getOfferInfo(offerIndex);
      const existingRanges: IRangesType[] = [];
      for await (const rangeIndex of [
        // eslint-disable-next-line
        ...Array.apply<null, any, unknown[]>(null, {
          length: offerData.availableRanges.toString()
        }).keys()
      ]) {
        const rangeInfo = await minterInstance?.getOfferRangeInfo(
          offerIndex,
          rangeIndex
        );
        if (Number(rangeInfo.collectionIndex.toString()) === productIndex) {
          existingRanges.push({
            offerIndex,
            endingToken: Number(rangeInfo.tokenEnd.toString()),
            name: rangeInfo.name,
            price: rangeInfo.price.toString(),
            disabled: true
          });
        }
      }
      setRanges(existingRanges);
      // <null, any, unknown[]>
    } catch (err) {
      console.error(err);
    }

    try {
      // Lock Ranges
      const existingLocks: IExistingLock[] = [];
      for await (const lockIndex of productInfo.locks) {
        const lockInfo = await tokenInstance?.getLockedRange(lockIndex);
        if (Number(lockInfo.productIndex.toString()) === productIndex) {
          existingLocks.push({
            startingToken: lockInfo.startingToken.toString(),
            endingToken: lockInfo.endingToken.toString(),
            countToUnlock: lockInfo.countToUnlock.toString(),
            disabled: true
          });
        }
      }
      setLocks(existingLocks);
    } catch (err) {
      const error = err as any;
      console.error(error?.data?.message);
    }
  }, [minterInstance, productIndex, productInfo.locks, tokenInstance]);

  const notDisabled = (item) => {
    return !item.disabled;
  };

  const updater = async (
    offerIndex: string | undefined,
    rangeIndex: number,
    startToken: number,
    endToken: number,
    price: string,
    name: string
  ) => {
    if (
      !offerIndex ||
      !rangeIndex === undefined ||
      startToken === undefined ||
      !endToken ||
      !price ||
      !name
    ) {
      console.error('Update Rejected');
      return;
    }
    if (!minterInstance) {
      return;
    }
    reactSwal.fire({
      title: 'Updating',
      html: 'Please wait',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(minterInstance, 'updateOfferRange', [
        offerIndex,
        rangeIndex,
        startToken,
        endToken,
        price,
        name
      ])
    ) {
      reactSwal.fire('Success', 'Offer updated', 'success');
    }
  };

  useEffect(() => {
    if (minterInstance) {
      minterInstance.on(
        'AppendedRange(address,uint256,uint256,uint256,uint256,uint256,uint256,string)',
        refresher
      );
    }
    return () => {
      minterInstance?.off(
        'AppendedRange(address,uint256,uint256,uint256,uint256,uint256,uint256,string)',
        refresher
      );
    };
  }, [minterInstance, refresher]);

  useEffect(() => {
    if (tokenInstance && minterInstance) {
      refresher();
    }
  }, [productInfo, tokenInstance, minterInstance, refresher]);
  return (
    <details
      style={{ position: 'relative' }}
      className="w-100 border border-secondary rounded">
      <summary>
        Product #{productIndex + 1}: {productInfo.name}
      </summary>
      <div className="row mx-0 px-0">
        <div className="col-12">
          <h5> Product Info </h5>
          First token: {productInfo.startingToken}
          <br />
          Last Token: {productInfo.endingToken}
          <br />
          Mintable Tokens Left: {productInfo.mintableTokensLeft}
          <br />
        </div>
        <hr className="w-100" />
        <div className="col-12" style={{ position: 'relative' }}>
          <button
            onClick={() => {
              const aux = [...ranges];
              aux.push({
                endingToken:
                  aux.length === 0
                    ? 0
                    : Number(aux[aux.length - 1].endingToken) + 1,
                name: '',
                price: String(0)
              });
              setRanges(aux);
            }}
            style={{
              background: secondaryButtonColor,
              color: textColor,
              position: 'absolute',
              right: 0,
              top: 0
            }}
            className="btn rair-button">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <h5> On the Minter Marketplace </h5>
          <table className="w-100">
            <thead>
              <tr>
                <th />
                <th> # </th>
                <th>Name</th>
                <th>Starts</th>
                <th>Ends</th>
                <th>Price for each</th>
                <th></th>
                <th>Locked Tokens</th>
              </tr>
            </thead>
            <tbody>
              {ranges.map((item, index, array) => {
                return (
                  <RangeManager
                    key={index}
                    disabled={item.disabled}
                    offerIndex={item.offerIndex}
                    updater={updater}
                    index={index}
                    array={array}
                    deleter={deleter}
                    sync={() => {
                      setForceSync(!forceSync);
                    }}
                    hardLimit={
                      +productInfo.endingToken - +productInfo.startingToken
                    }
                    locker={locker}
                    productIndex={productIndex}
                  />
                );
              })}
            </tbody>
          </table>
          <button
            onClick={async () => {
              try {
                if (!minterInstance) {
                  return;
                }
                if (ranges.length > 0 && ranges[0].disabled) {
                  reactSwal.fire({
                    title: 'Appending offers',
                    html: 'Please wait',
                    icon: 'info',
                    showConfirmButton: false
                  });
                  if (
                    await web3TxHandler(
                      minterInstance,
                      'appendOfferRangeBatch',
                      [
                        await minterInstance?.contractToOfferRange(
                          tokenInstance?.address,
                          productIndex
                        ),
                        ranges.filter(notDisabled).map((item, index, array) => {
                          if (index === 0) {
                            let i = 0;
                            for (; i < ranges.length; i++) {
                              if (!ranges[i].disabled) {
                                return ranges[i - 1].endingToken + 1;
                              }
                            }
                          }
                          return Number(array[index - 1].endingToken) + 1;
                        }),
                        ranges
                          .filter(notDisabled)
                          .map((item) => item.endingToken),
                        ranges.filter(notDisabled).map((item) => item.price),
                        ranges.filter(notDisabled).map((item) => item.name)
                      ]
                    )
                  ) {
                    reactSwal.fire('Success', 'Offers appended', 'success');
                  }
                } else {
                  reactSwal.fire({
                    title: 'Creating offer',
                    html: 'Please wait',
                    icon: 'info',
                    showConfirmButton: false
                  });
                  if (
                    await minterInstance?.addOffer(
                      tokenAddress,
                      productIndex,
                      ranges.map((item, index, array) =>
                        index === 0
                          ? 0
                          : Number(array[index - 1].endingToken) + 1
                      ),
                      ranges.map((item) => item.endingToken),
                      ranges.map((item) => item.price),
                      ranges.map((item) => item.name),
                      '0x3fD4268B03cce553f180E77dfC14fde00271F9B7'
                    )
                  ) {
                    reactSwal.fire('Success', 'Offer created', 'success');
                  }
                }
              } catch (err) {
                const error = err as any;
                console.error(err);
                reactSwal.fire('Error', error?.data?.message, 'error');
              }
            }}
            disabled={!ranges.filter((item) => !item.disabled).length}
            className="btn btn-warning">
            {ranges.length > 0 && ranges[0].disabled
              ? `Append ${
                  ranges.filter((item) => !item.disabled).length
                } ranges to the marketplace`
              : `Create offer with ${ranges.length} ranges on the marketplace`}
          </button>
        </div>
        {/* <div className='col-6' style={{position: 'relative'}}>
				<button
					style={{position: 'absolute', right: 0, top: 0}}
					onClick={e => {
						let aux = [...locks];
						aux.push({
							startingToken: 0,
							endingToken: 0,
							countToUnlock: 0,
							disabled: false
						});
						setLocks(aux);
					}}
					className='btn btn-success'>
          <FontAwesomeIcon icon={faPlus} />
				</button>
				<h5> Resale Locks </h5>
				<table className='w-100'>
					<thead>
						<tr>
							<th />
							<th> # </th>
							<th>
								Starts
							</th>
							<th>
								Ends
							</th>
							<th>
								Locked Tokens
							</th>
						</tr>
					</thead>
					<tbody>
						{locks.map((item, index, array) => {
							return <LockManager
										key={index}
										locker={locker}
										productIndex={productIndex}
										disabled={item.disabled}
										index={index}
										array={array}
										deleter={lockDeleter}
										sync={() => {setForceSync(!forceSync)}}
										hardLimit={productInfo.endingToken - productInfo.startingToken}
									/>
						})}
					</tbody>
				</table>
			</div> */}
      </div>
    </details>
  );
};

export default ProductManager;
