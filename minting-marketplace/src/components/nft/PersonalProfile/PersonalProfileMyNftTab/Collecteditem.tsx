import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { rFetch } from '../../../../utils/rFetch';
import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';

const Collecteditem = ({ item, profile, defaultImg, index, chainData }) => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const navigate = useNavigate();

  const getTokenData = useCallback(async () => {
    const response = await rFetch(`/api/v2/tokens/${item._id}`);

    if (response.success) {
      setTokenInfo(response.tokenData);
    }
  }, [item]);

  const redirection = useCallback(() => {
    if (tokenInfo && tokenInfo.contract && tokenInfo.product) {
      navigate(
        `/tokens/${tokenInfo.contract.blockchain}/${tokenInfo.contract.contractAddress}/${tokenInfo.product.collectionIndexInContract}/${tokenInfo.token}`
      );
    }
  }, [navigate, tokenInfo]);

  useEffect(() => {
    getTokenData();
  }, [getTokenData]);

  return (
    <div
      style={{
        cursor: 'pointer'
      }}
      onClick={() => {
        redirection();
      }}
      key={index}
      className="nft-item-collection grid-item">
      <ImageLazy
        className={`my-items-pict ${profile && 'row profile'} zoom-event`}
        src={`${item.metadata.image || defaultImg}`}
        alt={`My favorite NFT ${item.metadata.name}`}
      />
      <div className="w-100 bg-my-items">
        <div className="col my-items-description-wrapper my-items-pic-description-wrapper">
          <div className="container-blue-description" style={{ color: '#fff' }}>
            <span className="description-title">
              {item.metadata ? (
                <>
                  <span>{item.title}</span>
                </>
              ) : (
                <b> No metadata available </b>
              )}
              <br />
            </span>
            <div className="container-blockchain-info">
              <small className="description">
                {item.metadata && item.metadata.name.length > 16
                  ? item.metadata.name.slice(0, 5) +
                    '...' +
                    item.metadata.name.slice(item.metadata.name.length - 4)
                  : item.metadata.name}
              </small>
              <div className="description-small" style={{}}>
                <img
                  className="my-items-blockchain-img"
                  src={
                    item.contract.blockchain
                      ? `${chainData[item.contract.blockchain]?.image}`
                      : ''
                  }
                  alt="Blockchain network"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collecteditem;
