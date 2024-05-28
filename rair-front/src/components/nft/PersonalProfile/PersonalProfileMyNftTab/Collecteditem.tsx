import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import useSwal from '../../../../hooks/useSwal';
import { BillTransferIcon } from '../../../../images';
import { rFetch } from '../../../../utils/rFetch';
import { ImageLazy } from '../../../MockUpPage/ImageLazy/ImageLazy';

import ResaleModal from './ResaleModal/ResaleModal';

const Collecteditem = ({ item, profile, defaultImg, index, chainData }) => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const navigate = useNavigate();
  const reactSwal = useSwal();

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const { userAddress } = useParams();

  const getTokenData = useCallback(async () => {
    const response = await rFetch(
      `/api/tokens/id/${item._id}`,
      undefined,
      undefined,
      undefined
    );

    if (response.success) {
      setTokenInfo(response.tokenData);
    }
  }, [item]);

  const redirection = useCallback(() => {
    if (tokenInfo?.contract && tokenInfo?.product?.collectionIndexInContract) {
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
      onClick={redirection}
      key={index}
      className="nft-item-collection grid-item">
      {currentUserAddress === userAddress && (
        <button
          onClick={() => {
            reactSwal.fire({
              html: <ResaleModal textColor={textColor} item={item} />,
              showConfirmButton: false,
              showCloseButton: true,
              customClass: `resale-pop-up-custom ${
                primaryColor === 'rhyno' ? 'rhyno' : ''
              }`
            });
          }}
          className="nft-item-sell-buton">
          <BillTransferIcon primaryColor={primaryColor} />
        </button>
      )}
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
