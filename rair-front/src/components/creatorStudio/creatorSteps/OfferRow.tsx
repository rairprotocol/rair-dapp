import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faKey, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { utils } from 'ethers';

import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { validateInteger } from '../../../utils/metamaskUtils';
import colors from '../../../utils/offerLockColors';
import InputField from '../../common/InputField';
import { IOfferRow } from '../creatorStudio.types';

const OfferRow: React.FC<IOfferRow> = ({
  index,
  deleter,
  name,
  starts,
  ends,
  price,
  fixed,
  array,
  rerender,
  maxCopies,
  blockchainSymbol
}) => {
  const { primaryColor, secondaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [itemName, setItemName] = useState<string>(name);
  const [startingToken, setStartingToken] = useState<string>(starts);
  const [endingToken, setEndingToken] = useState<string>(ends);
  const [individualPrice, setIndividualPrice] = useState<string>(price);
  const randColor = colors[index];

  const updater = (
    name: string,
    setter: (value: string) => void,
    value: string
  ) => {
    array[index][name] = value;
    setter(value);
    rerender();
  };

  const updateEndingToken = useCallback(
    (value: string) => {
      array[index].ends = value;
      setEndingToken(value);
      if (array[index + 1] !== undefined) {
        array[index + 1].starts = String(Number(value) + 1);
      }
      rerender();
    },
    [array, index, rerender]
  );

  const updateStartingToken = useCallback(
    (value: string) => {
      array[index].starts = value;
      setStartingToken(value);
      if (Number(endingToken) < Number(value)) {
        updateEndingToken(value);
      }
      rerender();
    },
    [array, endingToken, index, rerender, updateEndingToken]
  );

  useEffect(() => {
    if (starts === startingToken) {
      return;
    }
    updateStartingToken(starts);
  }, [starts, updateStartingToken, startingToken]);

  useEffect(() => {
    if (ends === endingToken) {
      return;
    }
    updateEndingToken(ends);
  }, [ends, updateEndingToken, endingToken]);

  useEffect(() => {
    setIndividualPrice(price);
  }, [price]);

  useEffect(() => {
    setItemName(name);
  }, [name]);

  const disabledClass = fixed ? '' : 'border-stimorol rounded-rair';
  return (
    <>
      <tr>
        <th>
          <button disabled className={`btn btn-${primaryColor} rounded-rair"`}>
            <FontAwesomeIcon icon={faKey} style={{ color: randColor }} />
          </button>
        </th>
        <th className="p-1">
          <div className={`${disabledClass} w-100`}>
            <InputField
              getter={itemName}
              disabled={fixed}
              setter={(value) => updater('name', setItemName, value)}
              customClass="form-control rounded-rair"
              customCSS={{
                backgroundColor: primaryColor,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
            />
          </div>
        </th>
        <th className="p-1">
          <InputField
            disabled={true}
            getter={startingToken}
            setter={updateStartingToken}
            type="number"
            min={0}
            customClass="form-control rounded-rair"
            customCSS={{
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
          />
        </th>
        <th className="p-1">
          <div className={`${disabledClass} w-100`}>
            <InputField
              getter={endingToken}
              setter={updateEndingToken}
              customClass="form-control rounded-rair"
              disabled={fixed}
              type="number"
              min={
                Number(startingToken) > maxCopies
                  ? maxCopies
                  : Number(startingToken)
              }
              max={maxCopies}
              customCSS={{
                backgroundColor: primaryColor,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
            />
          </div>
        </th>
        <th className="p-1">
          <div className={`${disabledClass} w-100`}>
            <InputField
              getter={individualPrice}
              setter={(value) => updater('price', setIndividualPrice, value)}
              type="number"
              disabled={fixed}
              min={100}
              customClass="form-control rounded-rair"
              customCSS={{
                backgroundColor: primaryColor,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
            />
          </div>
        </th>
        <th>
          {!fixed && (
            <button onClick={deleter} className="btn btn-danger rounded-rair">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </th>
      </tr>
      <tr>
        <th />
        <th />
        <th />
        <th />
        <th className="text-center pt-0">
          <small>
            {utils
              .formatEther(
                individualPrice === '' ||
                  !validateInteger(Number(individualPrice))
                  ? 0
                  : individualPrice
              )
              .toString()}{' '}
            {blockchainSymbol}
          </small>
        </th>
        <th />
      </tr>
    </>
  );
};

export default OfferRow;
