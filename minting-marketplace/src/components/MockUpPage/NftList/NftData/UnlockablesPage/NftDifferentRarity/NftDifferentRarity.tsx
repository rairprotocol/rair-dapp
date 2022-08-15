//@ts-nocheck
import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import cl from './NftDifferentRarity.module.css';
import CustomButton from '../../../../utils/button/CustomButton';

const NftDifferentRarity = ({
  title,
  setTokenDataFiltered,
  isUnlocked,
  embeddedParams
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const { contract, product, blockchain } = embeddedParams
    ? embeddedParams
    : params;
  const sortedClickHandler = (tokenId) => {
    if (embeddedParams) {
      embeddedParams.setTokenId(tokenId);
      embeddedParams.setMode('collection');
    } else {
      navigate(`/collection/${blockchain}/${contract}/${product}/${tokenId}`);
    }
  };
  const [allTokenData, setAllTokenData] = useState([]);
  const [isOpenPart, setIsOpenPart] = useState(false);

  const checkThisPart = (data) => {
    const part = data.every((i) => i === true);
    setIsOpenPart(part);
  };
  useEffect(() => {
    checkThisPart(isUnlocked);
  }, [isUnlocked]);

  const getAllTokens = useCallback(async () => {
    const responseAllTokens = await axios.get(
      `/api/nft/network/${blockchain}/${contract}/${product}`
    );
    setAllTokenData(responseAllTokens.data.result.tokens);
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
        const firstTokenFromUnlockUltra = allTokenData.filter(
          (e) => e.offer === '0'
        );
        setTokenDataFiltered(firstTokenFromUnlockUltra);
        sortedClickHandler(firstTokenFromUnlockUltra[0].token);
        break;
      case 'Ultra Rair':
        const firstTokenFromUltra = allTokenData.filter((e) => e.offer === '0');
        setTokenDataFiltered(firstTokenFromUltra);
        sortedClickHandler(firstTokenFromUltra[0].token);
        break;
      case 'Unlock Rair':
        const secondTokenFromUnlockUltra = allTokenData.filter(
          (e) => e.offer === '1'
        );
        setTokenDataFiltered(secondTokenFromUnlockUltra);
        sortedClickHandler(secondTokenFromUnlockUltra[0].token);
        break;
      case 'Rair':
        const secondTokenFromUltra = allTokenData.filter(
          (e) => e.offer === '1'
        );
        setTokenDataFiltered(secondTokenFromUltra);
        sortedClickHandler(secondTokenFromUltra[0].token);
        break;
      default:
        const thirdTokenFromUltra = allTokenData.filter((e) => e.offer === '2');
        setTokenDataFiltered(thirdTokenFromUltra);
        sortedClickHandler(thirdTokenFromUltra[0].token);
    }
    /* eslint-enable */
  };
  useEffect(() => {
    getAllTokens();
  }, [getAllTokens]);
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
          className="custom-btn-rarity"
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
