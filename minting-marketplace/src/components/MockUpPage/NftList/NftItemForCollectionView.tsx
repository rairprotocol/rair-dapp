import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate, useParams } from 'react-router-dom';

import { SvgKey } from './SvgKey';

import chainData from '../../../utils/blockchainData';
import { ImageLazy } from '../ImageLazy/ImageLazy';
import {
  INftItemForCollectionView,
  TParamsNftItemForCollectionView
} from '../mockupPage.types';

import defaultImage from './../assets/defultUser.png';
import { gettingPrice } from './utils/gettingPrice';

const NftItemForCollectionViewComponent: React.FC<
  INftItemForCollectionView
> = ({
  embeddedParams,
  blockchain,
  pict,
  offerPrice,
  index,
  metadata,
  offer,
  selectedData,
  someUsersData,
  userName,
  tokenDataLength
}) => {
  const params = useParams<TParamsNftItemForCollectionView>();
  const navigate = useNavigate();

  const [playing, setPlaying] = useState<boolean>(false);
  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();

  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const checkUrl = useCallback(() => {
    if (selectedData?.animation_url) {
      const fileUrl = selectedData?.animation_url;
      const parts = fileUrl.split('/').pop()?.split('.');
      const ext = parts && parts?.length > 1 ? parts?.pop() : '';
      setIsFileUrl(ext);
    }
  }, [selectedData?.animation_url, setIsFileUrl]);

  function RedirectToMockUp() {
    redirection();
  }

  const redirection = embeddedParams
    ? () => {
        embeddedParams.setTokenId(index);
        embeddedParams.setMode('tokens');
      }
    : () => {
        navigate(
          `/tokens/${blockchain}/${params.contract}/${params.product}/${index}`
        );
      };

  function checkPrice() {
    if (offerPrice && offerPrice.length > 0) {
      const { maxPrice, minPrice } = gettingPrice(offerPrice);

      if (maxPrice === minPrice) {
        const samePrice = maxPrice;
        return `${samePrice.slice(0, 4)} ${
          blockchain && chainData[blockchain]?.symbol
        }`;
      }
      return `${minPrice.slice(0, 4)} – ${maxPrice.slice(0, 5)} ${
        blockchain && chainData[blockchain]?.symbol
      }`;
    }
  }

  function fullPrice() {
    if (offerPrice && offerPrice.length > 0) {
      const { maxPrice, minPrice } = gettingPrice(offerPrice);

      if (maxPrice && minPrice) {
        return `${minPrice} – ${maxPrice} ${
          blockchain && chainData[blockchain]?.symbol
        }`;
      }
    }
  }

  let className = 'col-12 text-start video-wrapper nft-item-collection';

  if (tokenDataLength && tokenDataLength < 4) {
    className += ' standartSize';
  }

  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  return (
    <div className={className}>
      <div
        onClick={() => {
          if (!metadata?.animation_url) RedirectToMockUp();
        }}
        className="col-12 rounded"
        style={{
          top: 0,
          position: 'relative',
          height: '100%',
          cursor: 'pointer'
        }}>
        {metadata?.animation_url &&
          (isFileUrl === 'gif' ? (
            <></>
          ) : (
            <div onClick={handlePlaying} className="btn-play">
              {playing ? (
                <div>
                  <i className="fas fa-pause"></i>
                </div>
              ) : (
                <div>
                  <i className="fas fa-play"></i>
                </div>
              )}
            </div>
          ))}
        {metadata?.animation_url ? (
          isFileUrl === 'gif' ? (
            <ImageLazy
              className="col-12 h-100 w-100 zoom-event"
              width={'282px'}
              height={'282px'}
              alt={metadata?.name === 'none' ? 'NFT token' : metadata?.name}
              src={metadata?.animation_url ? metadata?.animation_url : pict}
            />
          ) : (
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
              <ReactPlayer
                alt="metadata?.name === 'none' ? 'NFT token' : metadata?.name"
                url={`${metadata?.animation_url}`}
                light={metadata?.image ? metadata?.image : pict}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
                autoPlay={false}
                className="col-12 h-100 w-100"
                onReady={handlePlaying}
                playing={playing}
                onEnded={handlePlaying}
              />
            </div>
          )
        ) : (
          <ImageLazy
            className="col-12 h-100 w-100 zoom-event"
            width={'282px'}
            height={'282px'}
            alt={metadata?.name === 'none' ? 'NFT token' : metadata?.name}
            src={metadata?.image ? metadata?.image : pict}
          />
        )}
        {offer === '0' ? (
          <SvgKey color={'#E4476D'} bgColor={'rgba(34, 32, 33, 0.5)'} />
        ) : offer === '1' ? (
          <SvgKey color={'#CCA541'} bgColor={'rgba(34, 32, 33, 0.5)'} />
        ) : (
          <SvgKey color={'silver'} bgColor={'rgba(34, 32, 33, 0.5)'} />
        )}
        <div className="col description-wrapper pic-description-wrapper wrapper-for-collection-view">
          <div className="description-title">
            <div
              className="description-item-name"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
              {metadata?.name === 'none' ? '#' + index : metadata?.name}
              <div
                className="brief-infor-nftItem"
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxHeight: '40px'
                }}>
                <div>
                  {someUsersData ? (
                    <div className="collection-block-user-creator">
                      <img
                        src={
                          someUsersData.avatar
                            ? someUsersData.avatar
                            : defaultImage
                        }
                        alt="User Avatar"
                      />
                      <h5 style={{ wordBreak: 'break-all' }}>
                        {someUsersData.nickName
                          ? someUsersData.nickName.length > 16
                            ? someUsersData.nickName.slice(0, 5) +
                              '...' +
                              someUsersData.nickName.slice(
                                someUsersData.nickName.length - 4
                              )
                            : someUsersData.nickName
                          : userName?.slice(0, 5) +
                            '....' +
                            userName?.slice(userName.length - 4)}
                      </h5>
                    </div>
                  ) : (
                    <div className="collection-block-user-creator">
                      <img src={defaultImage} alt="User Avatar" />
                      <h5 style={{ wordBreak: 'break-all' }}>
                        {userName &&
                          userName.slice(0, 5) +
                            '....' +
                            userName.slice(userName.length - 4)}
                      </h5>
                    </div>
                  )}
                </div>
                <div
                  className="collection-block-price"
                  style={{ alignItems: 'flex-end' }}>
                  <img
                    src={blockchain && chainData[blockchain]?.image}
                    alt="Blockchain network"
                  />
                  {checkPrice()}
                </div>
              </div>
            </div>
          </div>
          <div onClick={RedirectToMockUp} className="description-big">
            <div>
              <img
                className="blockchain-img"
                src={`${blockchain && chainData[blockchain]?.image}`}
                alt="Blockchain network"
              />
            </div>
            <span className="description description-price description-price-unlockables-page">
              {fullPrice()}
            </span>
            <span className="description-more">View item</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NftItemForCollectionView = memo(NftItemForCollectionViewComponent);
