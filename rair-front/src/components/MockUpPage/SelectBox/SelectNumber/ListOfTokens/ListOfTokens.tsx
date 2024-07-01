import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
  TNftItemResponse,
  TTokenData
} from '../../../../../axios.responseTypes';
import { RootState } from '../../../../../ducks';
import { setTokenData } from '../../../../../ducks/nftData/action';
import { currentTokenData } from '../../../NftList/utils/currentTokenData';
import { IListOfTokensComponent } from '../../selectBox.types';
import { CurrentTokens } from '../CurrentTokens/CurrentTokens';

import '../../styles.css';

const ListOfTokensComponent: React.FC<IListOfTokensComponent> = ({
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
  setIsOpen,
  totalCount
}) => {
  const [productTokenNumbers, setProductTokenNumbers] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const listOfTokensRef = useRef<HTMLDivElement>(null);
  const limit = 100;
  const [isOpens, setIsOpens] = useState<boolean>(false);
  const [isBack /*setIsBack*/] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(true);

  const hotdropsVar = import.meta.env.VITE_TESTNET;

  const tokenData = useSelector<
    RootState,
    { [index: string]: TTokenData } | undefined
  >((state) => state.nftDataStore.tokenData);
  const dispatch = useDispatch();

  const getNumberFromStr = (str: string) => {
    const newStr = str.replace(' -', '');
    const first = newStr.slice(0, newStr.indexOf(' '));
    const second = newStr.slice(newStr.indexOf(' ') + 1);
    return [first, second];
  };

  const handleOpenListOfTokens = () => {
    setOpen(false);
  };

  const getPaginationData = useCallback(
    async (target: HTMLElement) => {
      const indexes = getNumberFromStr(target?.innerText);
      const responseAllProduct = await axios.get<TNftItemResponse>(
        `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=${indexes[0]}&toToken=${indexes[1]}&limit=${limit}`
      );
      const tokenMapping = {};
      if (responseAllProduct.data.success) {
        responseAllProduct.data.result.tokens.forEach((item) => {
          tokenMapping[item.token] = item;
        });
        dispatch(setTokenData(tokenMapping));
      }
      setSelectedToken(selectedToken);
      onClickItem(selectedToken);
      handleIsOpen();
    },
    [
      blockchain,
      contract,
      handleIsOpen,
      onClickItem,
      product,
      setSelectedToken,
      selectedToken,
      dispatch
    ]
  );

  const handleClickOutSideListOfTokens = useCallback(
    (e: MouseEvent) => {
      if (isOpens) {
        return;
      } else {
        if (!listOfTokensRef.current?.contains(e.target as Node)) {
          setOpen(true);
        }
      }
    },
    [listOfTokensRef, isOpens]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSideListOfTokens);
    return () =>
      document.removeEventListener('mousedown', handleClickOutSideListOfTokens);
  }, [handleClickOutSideListOfTokens, isOpen]);

  useEffect(() => {
    let isDestroyed = false;
    fetch(`/api/nft/network/${blockchain}/${contract}/${product}/`)
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
      productTokenNumbers?.reduce((acc, tokenNumber: string) => {
        const tokenRange = Math.floor(+tokenNumber / 100) * 100;
        return {
          ...acc,
          [tokenRange]: true
        };
      }, {}),
    [productTokenNumbers]
  );

  const getPaginationToken = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      getPaginationData(e.target as HTMLButtonElement);
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
      <div
        ref={numberRef}
        className="select-box--box select-box--box_listOfTokens">
        <div className="select-box--container">
          <div
            ref={appRef}
            className={`select-box--selected-item ${
              hotdropsVar === 'true' ? 'hotdrops-bg' : ''
            }`}>
            Choose Range
          </div>
          <div className="select-box--arrow"></div>
          <div
            style={{
              background: `${
                primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'
              }`
            }}
            id="rred"
            className={'select-box--items list-of-tokens'}
            ref={listOfTokensRef}>
            {ranges.map((i) => {
              return (
                <button
                  disabled={availableRanges?.[i] ? false : true}
                  key={i}
                  onClick={(e) => getPaginationToken(e)}
                  className={`serial-box serial-numb check-disable ${
                    hotdropsVar === 'true' ? 'hotdrops-bg' : ''
                  }`}>
                  {`${i} - ${i + 99}`}
                </button>
              );
            })}
            <span
              className="backClose-list-tokens"
              onClick={() => setOpen(true)}>
              &#10007;
            </span>
          </div>
        </div>
      </div>
    ) : (
      <>
        {tokenData !== undefined && (
          <CurrentTokens
            primaryColor={primaryColor}
            items={currentTokenData(tokenData)}
            isOpen={isOpen}
            isBack={isBack}
            selectedToken={selectedToken}
            setIsOpen={setIsOpen}
            setIsOpens={setIsOpens}
            numberRef={numberRef}
            handleIsOpen={handleIsOpen}
            onClickItem={onClickItem}
          />
        )}
      </>
    )
  ) : (
    <div
      className={`nft-single-price-range ${
        hotdropsVar === 'true' ? 'hotdrops-border' : ''
      }`}
      ref={rootRef}
      onClick={() => {
        handleOpenListOfTokens();
      }}>
      Selected now : {Number(selectedToken)}
    </div>
  );
};

export const ListOfTokens = memo(ListOfTokensComponent);
