import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, utils } from 'ethers';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import { validateInteger } from '../../../utils/metamaskUtils';
import { rFetch } from '../../../utils/rFetch';
// import colors from '../../../utils/offerLockColors';
import InputField from '../../common/InputField';
import { IDiamondOfferRow } from '../creatorStudio.types';
const DiamondOfferRow: React.FC<IDiamondOfferRow> = ({
  index,
  deleter,
  offerName,
  range,
  price,
  _id,
  array,
  rerender,
  maxCopies,
  blockchainSymbol,
  lockedCopies,
  allowedCopies,
  simpleMode,
  instance,
  diamondRangeIndex,
  sponsored,
  forceRefetch,
  fetchingData
}) => {
  const { primaryColor, textColor, primaryButtonColor, secondaryButtonColor } =
    useSelector<RootState, ColorStoreType>((store) => store.colorStore);

  const [itemName, setItemName] = useState(offerName);
  const [startingToken, setStartingToken] = useState<string>(range[0]);
  const [endingToken, setEndingToken] = useState<string>(range[1]);
  const [individualPrice, setIndividualPrice] = useState<string>(price);
  const [allowedTokenCount, setAllowedTokenCount] = useState<string>(
    allowedCopies || '0'
  );
  const [lockedTokenCount, setLockedTokenCount] = useState<string>(
    lockedCopies || '0'
  );
  const [valuesChanged, setValuesChanged] = useState<boolean>(false);
  // const randColor = colors[index];

  const reactSwal = useSwal();
  const { web3TxHandler } = useWeb3Tx();

  const updater = useCallback(
    (
      fieldName: string,
      setter: (someValue: any /*string | number */) => void,
      value: string,
      doRerender = true
    ) => {
      array[index][fieldName] = value;
      setter(value);
      if (doRerender) {
        if (_id && !valuesChanged) {
          setValuesChanged(true);
        }
        rerender();
      }
    },
    [array, index, rerender, _id, valuesChanged]
  );

  const updateEndingToken = useCallback(
    (value: string) => {
      if (!array) {
        return;
      }
      array[index].range[1] = value;
      setEndingToken(value);
      if (array[index + 1] !== undefined) {
        array[index + 1].range[0] = String(+value + 1);
      }
      rerender();
    },
    [array, index, rerender]
  );

  const updateStartingToken = useCallback(
    (value: string) => {
      if (!array) {
        return;
      }
      array[index].range[0] = value;
      setStartingToken(value);
      if (Number(endingToken) < Number(value)) {
        updateEndingToken(value);
      }
      rerender();
    },
    [array, endingToken, index, rerender, updateEndingToken]
  );

  useEffect(() => {
    if (range?.at(0) === startingToken) {
      return;
    }
    updateStartingToken(range[0]);
  }, [range, updateStartingToken, startingToken]);

  useEffect(() => {
    if (!endingToken || !startingToken) {
      return;
    }
    const correctCount = BigNumber.from(endingToken).sub(startingToken).add(1);
    if (!_id && simpleMode && !correctCount.eq(allowedTokenCount)) {
      updater(
        'tokensAllowed',
        setAllowedTokenCount,
        correctCount.toString(),
        false
      );
      updater(
        'lockedTokens',
        setLockedTokenCount,
        correctCount.toString(),
        false
      );
    }
    if (
      !_id &&
      validateInteger(allowedTokenCount) &&
      correctCount.lt(allowedTokenCount)
    ) {
      updater(
        'tokensAllowed',
        setAllowedTokenCount,
        correctCount.toString(),
        false
      );
    }
    if (
      !_id &&
      validateInteger(lockedTokenCount) &&
      correctCount.lt(lockedTokenCount)
    ) {
      updater(
        'lockedTokens',
        setLockedTokenCount,
        correctCount.toString(),
        false
      );
    }
    if (range?.at(1) === endingToken) {
      return;
    }
    updateEndingToken(range[1]);
  }, [
    range,
    updateEndingToken,
    endingToken,
    updater,
    setAllowedTokenCount,
    setLockedTokenCount,
    startingToken,
    allowedTokenCount,
    lockedTokenCount,
    simpleMode,
    _id,
    valuesChanged
  ]);

  useEffect(() => {
    setIndividualPrice(price);
  }, [price]);

  useEffect(() => {
    setItemName(offerName);
  }, [offerName]);

  const disabledClass =
    _id && !valuesChanged ? '' : 'border-stimorol rounded-rair';

  const updateRange = async () => {
    if (instance === undefined) {
      reactSwal.fire(
        'Error',
        "Couldn't connect to the contract, are you on the correct blockchain?",
        'error'
      );
      return;
    }
    reactSwal.fire({
      title: 'Updating range...',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(instance, 'updateRange', [
        diamondRangeIndex,
        itemName,
        individualPrice,
        allowedTokenCount,
        lockedTokenCount
      ])
    ) {
      reactSwal.fire({
        title: 'Success!',
        html: 'The range has been updated!',
        icon: 'success',
        showConfirmButton: true
      });
    }
  };

  const updateOffer = useCallback(async () => {
    await rFetch(`/api/offers/${_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        sponsored: !sponsored
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    forceRefetch();
  }, [_id, sponsored, forceRefetch]);

  return (
    <div className="col-12 row px-5">
      <div className={`col-12 col-md-11 px-2`}>
        Range name:
        <div className={`${disabledClass} w-100 mb-2`}>
          <InputField
            getter={itemName}
            setter={(value) => updater('offerName', setItemName, value)}
            customClass="form-control rounded-rair"
          />
        </div>
      </div>
      <div className={`col-12 col-md-1 pt-4 px-0`}>
        {_id ? (
          <button
            onClick={updateRange}
            disabled={!valuesChanged}
            style={{
              color: textColor,
              background: valuesChanged ? primaryButtonColor : 'green',
              border: `solid 1px ${textColor}`
            }}
            className="btn w-100 rair-button rounded-rair">
            {valuesChanged ? 'Update' : 'Saved'}
          </button>
        ) : (
          <button
            onClick={deleter}
            className="btn w-100 btn-danger rounded-rair">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
      <div className={`col-12 col-md-4`}>
        Starting token:
        <div className={`${!_id && disabledClass} w-100`}>
          <InputField
            disabled={true}
            getter={startingToken}
            setter={updateStartingToken}
            type="number"
            min={0}
            customClass="form-control rounded-rair"
          />
        </div>
      </div>
      <div className={`col-12 col-md-4`}>
        Ending token:
        {!_id && (
          <button
            onClick={() => updateEndingToken(String(maxCopies))}
            className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
            Max
          </button>
        )}
        <div className={`${!_id && disabledClass} w-100`}>
          <InputField
            getter={endingToken}
            setter={updateEndingToken}
            customClass="form-control rounded-rair"
            disabled={!!_id}
            type="number"
            min={+startingToken}
            max={maxCopies}
          />
        </div>
      </div>
      <div className={`col-12 col-md-4`}>
        Range price:
        <div className={`${disabledClass} w-100`}>
          <InputField
            getter={individualPrice}
            setter={(value) => updater('price', setIndividualPrice, value)}
            type="number"
            customClass="form-control rounded-rair"
          />
        </div>
      </div>
      {!simpleMode && (
        <>
          <div className="col-12 col-md-5">
            Tokens allowed to mint:
            {!_id && (
              <button
                onClick={() =>
                  updater(
                    'tokensAllowed',
                    setAllowedTokenCount,
                    BigNumber.from(endingToken)
                      .sub(startingToken)
                      .add(1)
                      .toString()
                  )
                }
                className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
                Max
              </button>
            )}
            <div className={`${disabledClass} w-100`}>
              <InputField
                getter={allowedTokenCount}
                setter={(value) =>
                  updater('tokensAllowed', setAllowedTokenCount, value)
                }
                type="number"
                min={0}
                max={Number(endingToken) - Number(startingToken) + 1}
                customClass="form-control rounded-rair"
              />
            </div>
          </div>
          <div className="col-12 col-md-5">
            Minted tokens needed before trades are unlocked:
            {!_id && (
              <button
                onClick={() =>
                  updater(
                    'lockedTokens',
                    setLockedTokenCount,
                    BigNumber.from(endingToken)
                      .sub(startingToken)
                      .add(1)
                      .toString()
                  )
                }
                className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
                Max
              </button>
            )}
            <div className={`${disabledClass} w-100`}>
              <InputField
                getter={lockedTokenCount}
                setter={(value) =>
                  updater('lockedTokens', setLockedTokenCount, value)
                }
                type="number"
                min={0}
                max={Number(endingToken) - Number(startingToken) + 1}
                customClass="form-control rounded-rair"
              />
            </div>
          </div>
          {_id && (
            <div className="col-12 col-md-2">
              <button
                onClick={updateOffer}
                disabled={fetchingData}
                className="btn mt-4 rair-button"
                style={{
                  color: textColor,
                  background: sponsored
                    ? primaryButtonColor
                    : secondaryButtonColor
                }}>
                Minting {sponsored ? 'sponsored' : 'paid by user'}
              </button>
            </div>
          )}
        </>
      )}
      {validateInteger(individualPrice) &&
        validateInteger(endingToken) &&
        validateInteger(startingToken) && (
          <div className="text-center">
            Will create{' '}
            <b>
              {(
                BigInt(endingToken) -
                BigInt(startingToken) +
                BigInt(1)
              ).toString()}
            </b>{' '}
            tokens for{' '}
            <b>
              {utils
                .formatEther(!individualPrice ? 0 : individualPrice.toString())
                .toString()}{' '}
              {blockchainSymbol}
            </b>{' '}
            each
          </div>
        )}
      <hr className="my-4" />
    </div>
  );
};

export default DiamondOfferRow;
