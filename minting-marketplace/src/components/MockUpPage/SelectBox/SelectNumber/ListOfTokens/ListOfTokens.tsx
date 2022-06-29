//@ts-nocheck
import React, { useRef, memo, useCallback, useState, useMemo } from 'react';
import { useEffect } from 'react';
import { CurrentTokens } from '../CurrentTokens/CurrentTokens';
import '../../styles.css';
import { TNftItemResponse } from '../../../../../axios.responseTypes';
import axios from 'axios';

const ListOfTokensComponent = ({
  blockchain,
  contract,
  isOpen,
  handleIsOpen,
  numberRef,
  onClickItem,
  product,
  primaryColor,
  setSelectedToken,
  selectedToken,
  selectedItem,
  setIsOpen,
  totalCount
}) => {
  const [tokenData, setTokenData] = useState([]);
  const [productTokenNumbers, setProductTokenNumbers] = useState([]);
  const rootRef = useRef();
  const appRef = useRef();
  const limit = 100;
  const [isOpens, setIsOpens] = useState(false);
  const [isBack /*setIsBack*/] = useState(true);

  const [open, setOpen] = useState(true);

  const getNumberFromStr = (str) => {
    const newStr = str.replace(' -', '');
    const first = newStr.slice(0, newStr.indexOf(' '));
    const second = newStr.slice(newStr.indexOf(' ') + 1);
    // const second = Number(newStr.slice(newStr.indexOf(" ") + 1)) + 1;
    return [first, second];
  };

  const getPaginationData = useCallback(
    async (target) => {
      const indexes = getNumberFromStr(target.innerText);
      const responseAllProduct = await axios.get<TNftItemResponse>(
        `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=${indexes[0]}&toToken=${indexes[1]}&limit=${limit}`
      );
      const { result } = responseAllProduct.data;
      setTokenData(result.tokens);
      setSelectedToken(indexes[0]);
      // setSelectedToken(Number(indexes[0]));
      onClickItem(indexes[0]);
      // onClickItem(Number(indexes[0]));
      handleIsOpen(true);
    },
    [blockchain, contract, handleIsOpen, onClickItem, product, setSelectedToken]
  );

  // console.log(tokenData, 'tokenData');
  // console.log(productTokenNumbers, 'productTokenNumbers');

  useEffect(() => {
    let isDestroyed = false;
    fetch(`/api/nft/network/${blockchain}/${contract}/${product}/tokenNumbers`)
      .then((res) => res.json())
      .then((response) => {
        if (!isDestroyed) {
          setProductTokenNumbers(response.tokens);
        }
      });
    return () => {
      isDestroyed = true;
    };
  }, [blockchain, product, contract, setProductTokenNumbers]);

  const availableRanges = useMemo(
    () =>
      productTokenNumbers.reduce((acc, tokenNumber) => {
        const tokenRange = Math.floor(tokenNumber / 100) * 100;
        return {
          ...acc,
          [tokenRange]: true
        };
      }, {}),
    [productTokenNumbers]
  );

  const getPaginationToken = useCallback(
    (e) => {
      getPaginationData(e.target);
      setIsOpens(true);
    },
    [getPaginationData, setIsOpens]
  );

  const ranges = useMemo(() => {
    if (totalCount) {
      const number = 999;
      const rangesCount = Math.floor(number / 100) + 1;
      return Array(rangesCount)
        .fill(0)
        .map((_, idx) => idx * 100);
    }
    return [];
  }, [totalCount]);

  return !open ? (
    !isOpens ? (
      <div ref={numberRef} className="select-box--box">
        <div className="select-box--container">
          <div ref={appRef} className="select-box--selected-item">
            Choose Range
          </div>
          <div className="select-box--arrow"></div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              alignContent: 'center',
              width: '25rem',
              padding: '10px 0',
              // background: "#383637",
              background: `${
                primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'
              }`,
              borderRadius: '16px',
              border: '1px solid #D37AD6'
            }}
            id="rred"
            className={'select-box--items'}
            ref={rootRef}>
            {ranges.map((i) => {
              return (
                <button
                  disabled={availableRanges[i] ? false : true}
                  key={i}
                  onClick={(e) => getPaginationToken(e)}
                  className="serial-box serial-numb llll"
                  style={{
                    // border: "1px solid #D37AD6",
                    background: '#a7a6a6',
                    color: '#rgb(0 0 0)'
                    // background: availableRanges[i] ? "grey" : "red",
                  }}>
                  {`${i} - ${i + 99}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    ) : (
      <CurrentTokens
        primaryColor={primaryColor}
        items={tokenData}
        isOpen={isOpen}
        isBack={isBack}
        selectedToken={selectedToken}
        selectedItem={selectedItem}
        setIsOpen={setIsOpen}
        setIsOpens={setIsOpens}
        numberRef={numberRef}
        handleIsOpen={handleIsOpen}
        onClickItem={onClickItem}
      />
    )
  ) : (
    <div
      style={{ cursor: 'pointer' }}
      className="nft-single-price-range"
      ref={rootRef}
      onClick={() => setOpen(false)}>
      Selected now : {Number(selectedToken)}
    </div>
  );
};

export const ListOfTokens = memo(ListOfTokensComponent);
