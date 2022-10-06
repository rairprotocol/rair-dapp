import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { utils } from 'ethers';
import Swal from 'sweetalert2';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { metamaskCall, validateInteger } from '../../../utils/metamaskUtils';
import colors from '../../../utils/offerLockColors';
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
  copies,
  lockedTokens,
  simpleMode,
  instance,
  diamondRangeIndex
}) => {
  const { primaryColor, secondaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [itemName, setItemName] = useState(offerName);
  const [startingToken, setStartingToken] = useState<string>(range[0]);
  const [endingToken, setEndingToken] = useState<string>(range[1]);
  const [individualPrice, setIndividualPrice] = useState<string>(price);
  const [allowedTokenCount, setAllowedTokenCount] = useState<number>(copies);
  const [lockedTokenCount, setLockedTokenCount] = useState<string>(
    lockedTokens || '0'
  );
  const [valuesChanged, setValuesChanged] = useState<boolean>(false);
  const randColor = colors[index];
  const updater = useCallback(
    (
      fieldName: string,
      setter: (someValue: any /*string | number */) => void,
      value: number,
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
    const correctCount = +endingToken - +startingToken + 1;
    if (!_id && simpleMode && correctCount !== allowedTokenCount) {
      updater('tokensAllowed', setAllowedTokenCount, correctCount, false);
      updater('lockedTokens', setLockedTokenCount, correctCount, false);
    }
    if (!_id && correctCount < allowedTokenCount) {
      updater('tokensAllowed', setAllowedTokenCount, correctCount, false);
    }
    if (!_id && correctCount < +lockedTokenCount) {
      updater('lockedTokens', setLockedTokenCount, correctCount, false);
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
      Swal.fire(
        'Error',
        "Couldn't connect to the contract, are you on the correct blockchain?",
        'error'
      );
      return;
    }
    Swal.fire({
      title: 'Updating range...',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await metamaskCall(
        instance.updateRange(
          diamondRangeIndex,
          itemName,
          individualPrice,
          allowedTokenCount,
          lockedTokenCount
        )
      )
    ) {
      Swal.fire({
        title: 'Success!',
        html: 'The range has been updated!',
        icon: 'success',
        showConfirmButton: true
      });
    }
  };

  return (
    <div className="col-12 row">
      <button
        disabled
        className="col-12 col-md-1 btn btn-charcoal rounded-rair">
        <i style={{ color: `${randColor}` }} className="fas fa-key h1" />
      </button>
      <div className="col-12 col-md-11 row">
        <div className={`col-12 col-md-11 px-2`}>
          Range name:
          <div className={`${disabledClass} w-100 mb-2`}>
            <InputField
              getter={itemName}
              setter={(value) => updater('offerName', setItemName, value)}
              customClass="form-control rounded-rair"
              customCSS={{
                backgroundColor: `var(--${primaryColor})`,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
            />
          </div>
        </div>
        <div className={`col-12 col-md-1 pt-4 px-0`}>
          {_id ? (
            <button
              onClick={updateRange}
              disabled={!valuesChanged}
              className={`btn w-100 btn-${
                valuesChanged ? 'stimorol' : 'success'
              } rounded-rair`}>
              {valuesChanged ? 'Update' : 'Saved'}
            </button>
          ) : (
            <button
              onClick={deleter}
              className="btn w-100 btn-danger rounded-rair">
              <i className="fas fa-trash" />
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
              customCSS={{
                backgroundColor: `var(--${primaryColor})`,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
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
              customCSS={{
                backgroundColor: `var(--${primaryColor})`,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
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
              min={100}
              customClass="form-control rounded-rair"
              customCSS={{
                backgroundColor: `var(--${primaryColor})`,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
            />
          </div>
          {validateInteger(+individualPrice) && (
            <small>
              {utils
                .formatEther(!individualPrice ? 0 : individualPrice.toString())
                .toString()}{' '}
              {blockchainSymbol}
            </small>
          )}
        </div>
        {!simpleMode && (
          <div className={`col-12 col-md-6`}>
            Tokens allowed to mint:
            {!_id && (
              <button
                onClick={() =>
                  updater(
                    'copies',
                    setAllowedTokenCount,
                    Number(endingToken) - Number(startingToken) + 1
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
                  updater('copies', setAllowedTokenCount, value)
                }
                type="number"
                min={0}
                max={Number(endingToken) - Number(startingToken) + 1}
                customClass="form-control rounded-rair"
                customCSS={{
                  backgroundColor: `var(--${primaryColor})`,
                  color: 'inherit',
                  borderColor: `var(--${secondaryColor}-40)`
                }}
              />
            </div>
          </div>
        )}
        {!simpleMode && (
          <div className={`col-12 col-md-6`}>
            Minted tokens needed before trades are unlocked:
            {!_id && (
              <button
                onClick={() =>
                  updater(
                    'lockedTokens',
                    setLockedTokenCount,
                    Number(endingToken) - Number(startingToken) + 1
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
                customCSS={{
                  backgroundColor: `var(--${primaryColor})`,
                  color: 'inherit',
                  borderColor: `var(--${secondaryColor}-40)`
                }}
              />
            </div>
          </div>
        )}
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default DiamondOfferRow;
