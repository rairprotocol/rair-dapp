import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  faChevronDown,
  faChevronUp,
  faRotateLeft,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../../../../hooks/useReduxHooks';
import LoadingComponent from '../../../common/LoadingComponent';
import { ISelectNumber } from '../selectBox.types';

import './SelectNumber.css';
import '../styles.css';

const SelectNumber: React.FC<ISelectNumber> = ({
  handleClickToken,
  setSelectedToken,
  serialNumberData
}) => {
  const { currentCollection, currentCollectionMetadata } = useAppSelector(
    (store) => store.tokens
  );
  const {
    primaryColor,
    textColor,
    isDarkMode,
    primaryButtonColor,
    secondaryColor,
    iconColor
  } = useAppSelector((store) => store.colors);

  const [tokenRange, setTokenRange] = useState<Array<string>>([]);

  const [rangePickerOpen, setRangePickerOpen] = useState<boolean>(false);
  const [tokenPickerOpen, setTokenPickerOpen] = useState<boolean>(false);
  const [tokenPickerVisible, setIsTokenPickerVisible] =
    useState<boolean>(false);

  const numberRef = useRef<HTMLDivElement>(null);

  const handleClickOutSideNumberItem = useCallback(
    (e: MouseEvent) => {
      if (!numberRef.current?.contains(e.target as Node)) {
        setIsTokenPickerVisible(false);
      }
    },
    [numberRef, setIsTokenPickerVisible]
  );

  const handleClickOutSideListOfTokens = useCallback(
    (e: MouseEvent) => {
      if (tokenPickerOpen) {
        return;
      } else {
        if (!listOfTokensRef.current?.contains(e.target as Node)) {
          setRangePickerOpen(false);
        }
      }
    },
    [tokenPickerOpen]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideNumberItem);
    document.addEventListener('mousedown', handleClickOutSideListOfTokens);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSideNumberItem);
      document.removeEventListener('mousedown', handleClickOutSideListOfTokens);
    };
  }, [handleClickOutSideNumberItem, handleClickOutSideListOfTokens]);

  const onClickItem = (el: string | undefined) => {
    setSelectedToken(el);
    handleClickToken(el);
    setIsTokenPickerVisible(!tokenPickerVisible);
  };

  const { tokenId } = useParams();

  const rootRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const listOfTokensRef = useRef<HTMLDivElement>(null);

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const getPaginationData = useCallback(
    async (range) => {
      setTokenRange(range);
      setTokenPickerOpen(true);
      setRangePickerOpen(false);
      setIsTokenPickerVisible(!tokenPickerVisible);
    },
    [tokenPickerVisible]
  );

  const ranges = useMemo(() => {
    if (serialNumberData) {
      const pages =
        Math.floor(serialNumberData.length / 100) +
        Number(serialNumberData.length % 100 > 0);
      const arr = Array(pages)
        .fill(0)
        .map((_, pageNumber) => {
          const expectedTopOfPage = (pageNumber + 1) * 100 - 1;
          return [
            serialNumberData[pageNumber * 100]?.token,
            serialNumberData[
              expectedTopOfPage > serialNumberData.length
                ? serialNumberData.length - 1
                : expectedTopOfPage
            ]?.token
          ];
        });
      return arr;
    }
    return [];
  }, [serialNumberData]);

  if (rangePickerOpen) {
    return (
      <div
        ref={numberRef}
        className="select-box--box select-box--box_listOfTokens">
        <div className="select-box--container">
          <div
            ref={appRef}
            className={`select-box--selected-item ${
              hotdropsVar === 'true' ? 'hotdrops-bg' : ''
            }`}>
            Select a Range
          </div>
          <div className="select-box--arrow"></div>
          <div
            style={{
              background: primaryColor,
              top: '0',
              alignContent: 'baseline'
            }}
            id="rred"
            className={'select-box--items list-of-tokens select-number-popup'}
            ref={listOfTokensRef}>
            {ranges.map((range, index) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    setTokenPickerOpen(true);
                    setTokenPickerOpen(false);
                    getPaginationData(range);
                  }}
                  className={`serial-box serial-numb check-disable ${
                    hotdropsVar === 'true' ? 'hotdrops-bg' : ''
                  }`}>
                  {range[0]} - {range[1]}
                </button>
              );
            })}
            <FontAwesomeIcon
              onClick={() => setRangePickerOpen(false)}
              className="backClose-list-tokens"
              icon={faTimes}
            />
          </div>
        </div>
      </div>
    );
  }

  if (tokenPickerOpen) {
    return (
      <div ref={numberRef} className="select-number-container">
        <div
          onClick={() => setIsTokenPickerVisible(!tokenPickerVisible)}
          className="select-field"
          style={{
            borderColor: `${
              !isDarkMode
                ? import.meta.env.VITE_TESTNET === 'true'
                  ? 'var(--hot-drops)'
                  : '#E882D5'
                : `color-mix(in srgb, ${secondaryColor}, #888888)`
            }`,

            backgroundColor: `${
              !isDarkMode
                ? 'var(--rhyno-40)'
                : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
            }`
          }}>
          <div className="number-item">
            {!!tokenId && currentCollection[tokenId]?.token}
          </div>
          <FontAwesomeIcon
            style={{ color: iconColor }}
            icon={tokenPickerVisible ? faChevronUp : faChevronDown}
          />
        </div>
        <div
          style={{
            display: `${tokenPickerVisible ? 'flex' : 'none'}`,
            backgroundColor: `${
              !isDarkMode
                ? 'var(--rhyno-40)'
                : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
            }`,
            border: `${!isDarkMode ? '1px solid #D37AD6' : 'none'}`
          }}
          className={`select-number-popup ${
            import.meta.env.VITE_TESTNET === 'true' ? 'hotdrops' : ''
          }`}>
          <div className="select-number-title">
            <div
              className="backClose-current-tokens backClose-current-tokens-back-sign"
              style={{
                visibility: serialNumberData.length > 100 ? 'visible' : 'hidden'
              }}
              onClick={() => {
                setRangePickerOpen(false);
                setTokenPickerOpen(false);
              }}>
              <FontAwesomeIcon
                icon={faRotateLeft}
                style={{ color: iconColor }}
              />
            </div>
            <div className="serial-number-title">Serial number</div>
            <div
              className="backClose-current-tokens backClose-current-tokens-close-sign"
              onClick={() => setIsTokenPickerVisible(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
          {serialNumberData?.length &&
            serialNumberData
              .filter((token) => {
                return (
                  BigInt(token.token) >= BigInt(tokenRange[0]) &&
                  BigInt(token.token) <= BigInt(tokenRange[1])
                );
              })
              .map((el, index) => {
                return (
                  <div
                    key={index}
                    className={`select-number-box ${
                      tokenId === el.token ? 'selected-box' : ''
                    } ${el.sold ? 'sold-token' : ''}`}
                    data-title={` #${el.token}`}
                    style={{
                      background: `${
                        import.meta.env.VITE_TESTNET === 'true'
                          ? 'var(--hot-drops)'
                          : !isDarkMode
                            ? 'linear-gradient(to right, #e882d5, #725bdb)'
                            : primaryButtonColor
                      }`,
                      color: `${!isDarkMode ? '#fff' : textColor}`,
                      fontWeight: 'bold'
                    }}
                    onClick={() => onClickItem(el.token)}>
                    {el.sold ? 'Sold' : el.token}
                  </div>
                );
              })}
        </div>
      </div>
    );
  }

  if (!tokenId || !currentCollectionMetadata.product) {
    return <LoadingComponent />;
  }

  const realNumber = (
    BigInt(tokenId) + BigInt(currentCollectionMetadata.product?.firstTokenIndex)
  ).toString();

  return (
    <div
      className={`nft-single-price-range ${
        hotdropsVar === 'true' ? 'hotdrops-border' : ''
      }`}
      ref={rootRef}
      onClick={() => {
        if (serialNumberData.length <= 100) {
          getPaginationData(ranges[0]);
        } else {
          setRangePickerOpen(!rangePickerOpen);
        }
      }}>
      Selected now: {!!realNumber && currentCollection[realNumber]?.token}
    </div>
  );
};

export default SelectNumber;
