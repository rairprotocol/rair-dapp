import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import { TTokenData } from '../../../../../../axios.responseTypes';
import CustomButton from '../../../../utils/button/CustomButton';
import {
  INftDifferentRarity,
  TParamsNftDataCommonLink
} from '../../../nftList.types';

import cl from './NftDifferentRarity.module.css';

const NftDifferentRarity: React.FC<INftDifferentRarity> = ({
  title,
  setTokenDataFiltered,
  isUnlocked,
  embeddedParams
}) => {
  const navigate = useNavigate();
  const params = useParams<TParamsNftDataCommonLink>();
  const { contract, product, blockchain } = embeddedParams
    ? embeddedParams
    : params;
  const sortedClickHandler = (tokenId: string) => {
    if (embeddedParams) {
      embeddedParams.setTokenId(tokenId);
      embeddedParams.setMode('collection');
    } else {
      navigate(`/collection/${blockchain}/${contract}/${product}/${tokenId}`);
    }
  };
  const [allTokenData, setAllTokenData] = useState<TTokenData[]>([]);
  const [isOpenPart, setIsOpenPart] = useState<boolean>(false);

  const checkThisPart = (data: boolean[]) => {
    const part = data.every((i: boolean) => i === true);
    setIsOpenPart(part);
  };

  useEffect(() => {
    checkThisPart(isUnlocked);
  }, [isUnlocked]);

  const getAllTokens = useCallback(async () => {
    const responseAllTokenNumbers = await axios.get(
      `/api/nft/network/${blockchain}/${contract}/${product}/tokenNumbers`
    );

    if (responseAllTokenNumbers.data.tokens) {
      const responseAllTokens = await axios.get(
        `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=0&toToken=${responseAllTokenNumbers.data.tokens.length}`
      );
      setAllTokenData(responseAllTokens.data.result.tokens);
    }
  }, [product, contract, blockchain]);

  const colorRarity =
    title === 'Unlock Ultra Rair' || title === 'Ultra Rair'
      ? '#E4476D'
      : title === 'Unlock Rair' || title === 'Rair'
      ? 'gold'
      : 'silver';
  const sortedClick = () => {
    // mb need to refactor
    /* eslint-disable */
    switch (title) {
      case 'Unlock Ultra Rair':
        const firstTokenFromUnlockUltra: TTokenData[] = allTokenData.filter(
          (e) => e.offer.offerIndex === '0'
        );
        setTokenDataFiltered(firstTokenFromUnlockUltra);
        sortedClickHandler(firstTokenFromUnlockUltra[0].token);
        break;
      case 'Ultra Rair':
        const firstTokenFromUltra = allTokenData.filter(
          (e) => e.offer.offerIndex === '0'
        );
        setTokenDataFiltered(firstTokenFromUltra);
        sortedClickHandler(firstTokenFromUltra[0].token);
        break;
      case 'Unlock Rair':
        const secondTokenFromUnlockUltra = allTokenData.filter(
          (e) => e.offer.offerIndex === '1'
        );
        setTokenDataFiltered(secondTokenFromUnlockUltra);
        sortedClickHandler(secondTokenFromUnlockUltra[0].token);
        break;
      case 'Rair':
        const secondTokenFromUltra = allTokenData.filter(
          (e) => e.offer.offerIndex === '1'
        );
        setTokenDataFiltered(secondTokenFromUltra);
        sortedClickHandler(secondTokenFromUltra[0].token);
        break;
      default:
        const thirdTokenFromUltra = allTokenData.filter(
          (e) => e.offer.offerIndex === '2'
        );
        setTokenDataFiltered(thirdTokenFromUltra);
        sortedClickHandler(thirdTokenFromUltra[0].token);
    }
  };
  useEffect(() => {
    getAllTokens();
  }, []);

  return (
    <div className={cl.mainWrapper}>
      <div className={cl.main}>
        <i
          style={{ color: colorRarity }}
          className={`fas fa-key ${cl.iconKey}`}
        />
        <span style={{ color: colorRarity }} className={cl.rarity}>
          {title}
        </span>
      </div>
      {isOpenPart ? (
        <span className={cl.unlockText}>&#10003; Unlocked</span>
      ) : (
        <CustomButton
          text={title}
          width={'224px'}
          height={'48px'}
          margin={'0'}
          onClick={sortedClick}
        />
      )}
      {/* <CustomButton
        text={title}
        width={"224px"}
        height={"48px"}
        margin={"0"}
        onClick={sortedClick}
      /> */}
    </div>
  );
};

export default NftDifferentRarity;
