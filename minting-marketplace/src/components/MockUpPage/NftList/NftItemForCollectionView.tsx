//@ts-nocheck
import React, { useState, memo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gettingPrice } from './utils/gettingPrice';
import { SvgKey } from './SvgKey';
import chainData from '../../../utils/blockchainData';
import defaultImage from './../assets/defultUser.png';
import ReactPlayer from 'react-player';

const NftItemForCollectionViewComponent = ({
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
  const params = useParams();
  const navigate = useNavigate();

  const [playing, setPlaying] = useState(false);
  const [isFileUrl, setIsFileUrl] = useState();

  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const checkUrl = useCallback(() => {
    if (selectedData?.animation_url) {
      // refactored
      const fileUrl = selectedData?.animation_url;
      const parts = fileUrl.split('/').pop().split('.');
      const ext = parts.length > 1 ? parts.pop() : '';
      setIsFileUrl(ext);
    }
  }, [selectedData?.animation_url, setIsFileUrl]);

  function RedirectToMockUp() {
    redirection();
  }

  const redirection = () => {
    navigate(
      `/tokens/${blockchain}/${params.contract}/${params.product}/${index}`
    );
  };

  function checkPrice() {
    if (offerPrice.length > 0) {
      const { maxPrice, minPrice } = gettingPrice(offerPrice);

      if (maxPrice === minPrice) {
        const samePrice = maxPrice;
        return `${samePrice.slice(0, 4)} ${chainData[blockchain]?.symbol}`;
      }
      return `${minPrice.slice(0, 4)} – ${maxPrice.slice(0, 5)} ${
        chainData[blockchain]?.symbol
      }`;
    }
  }

  function fullPrice() {
    if (offerPrice.length > 0) {
      const { maxPrice, minPrice } = gettingPrice(offerPrice);

      if (maxPrice && minPrice) {
        return `${minPrice} – ${maxPrice} ${chainData[blockchain]?.symbol}`;
      }
    }
  }

  let className =
    'col-12 p-1 col-sm-6 col-md-4 col-lg-3 text-start video-wrapper nft-item-collection';

  if (tokenDataLength < 4) {
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
            <img
              alt="thumbnail"
              src={metadata?.animation_url ? metadata?.animation_url : pict}
              style={{
                position: 'absolute',
                bottom: 0,
                borderRadius: '16px',
                objectFit: 'contain'
              }}
              className="col-12 h-100 w-100"
            />
          ) : (
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
              <ReactPlayer
                alt="thumbnail"
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
          <img
            alt="thumbnail"
            src={
              // metaDataProducts?.metadata?.image
              metadata?.image
                ? // ? metaDataProducts?.metadata?.image
                  metadata?.image
                : pict
            }
            style={{
              position: 'absolute',
              bottom: 0,
              borderRadius: '16px',
              objectFit: 'contain'
            }}
            className="col-12 h-100 w-100"
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
                  alignItems: 'center'
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
                        alt="user"
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
                          : userName.slice(0, 5) +
                            '....' +
                            userName.slice(userName.length - 4)}
                      </h5>
                    </div>
                  ) : (
                    <div className="collection-block-user-creator">
                      <img src={defaultImage} alt="user" />
                      <h5 style={{ wordBreak: 'break-all' }}>
                        {userName &&
                          userName.slice(0, 5) +
                            '....' +
                            userName.slice(userName.length - 4)}
                      </h5>
                    </div>
                  )}
                </div>
                <div className="collection-block-price">
                  <img src={chainData[blockchain]?.image} alt="blockchain" />
                  {checkPrice()}
                </div>
              </div>
            </div>
          </div>
          <div onClick={RedirectToMockUp} className="description-big">
            <div>
              <img
                className="blockchain-img"
                src={`${chainData[blockchain]?.image}`}
                alt=""
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
