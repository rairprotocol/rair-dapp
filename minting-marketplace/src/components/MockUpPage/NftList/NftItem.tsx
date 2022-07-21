//@ts-nocheck
import React, { useState, useCallback, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SvgKey } from './SvgKey';
import { TNftItemResponse, TUserResponse } from '../../../axios.responseTypes';
import { useStateIfMounted } from 'use-state-if-mounted';
import { gettingPrice } from './utils/gettingPrice';
import chainData from '../../../utils/blockchainData';
import ReactPlayer from 'react-player';
import defaultAvatar from './../../UserProfileSettings/images/defaultUserPictures.png';
import axios from 'axios';
import { utils } from 'ethers';

const NftItemComponent = ({
  blockchain,
  price,
  pict,
  contractName,
  collectionIndexInContract,
  collectionName,
  ownerCollectionUser
}) => {
  const navigate = useNavigate();
  const [metaDataProducts, setMetaDataProducts] = useStateIfMounted();
  const [accountData, setAccountData] = useStateIfMounted(null);
  const [playing, setPlaying] = useState(false);
  const [isFileUrl, setIsFileUrl] = useState();

  const { maxPrice, minPrice } = gettingPrice(price);

  const checkUrl = useCallback(() => {
    if (
      metaDataProducts &&
      metaDataProducts.metadata &&
      metaDataProducts.metadata.animation_url
    ) {
      const fileUrl = metaDataProducts.metadata?.animation_url;
      const parts = fileUrl.split('/').pop().split('.');
      const ext = parts.length > 1 ? parts.pop() : '';
      setIsFileUrl(ext);
    }
  }, [metaDataProducts, setIsFileUrl]);

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (ownerCollectionUser && utils.isAddress(ownerCollectionUser)) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${ownerCollectionUser}`)
        .then((res) => res.data);
      setAccountData(result.user);
    }
  }, [ownerCollectionUser, setAccountData]);

  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const getProductAsync = useCallback(async () => {
    const responseProductMetadata = await axios.get<TNftItemResponse>(
      `/api/nft/network/${blockchain}/${contractName}/${collectionIndexInContract}`
    );
    if (responseProductMetadata.data.result.tokens.length > 0) {
      setMetaDataProducts(responseProductMetadata.data.result?.tokens[0]);
    }
  }, [
    blockchain,
    contractName,
    collectionIndexInContract,
    setMetaDataProducts
  ]);

  function RedirectToMockUp() {
    redirection();
  }

  const redirection = () => {
    navigate(
      `/collection/${blockchain}/${contractName}/${collectionIndexInContract}/0`
    );
  };

  function checkPrice() {
    if (maxPrice === minPrice) {
      const samePrice = maxPrice;
      return `${samePrice ? samePrice : samePrice} ${
        chainData[blockchain]?.symbol
      }`;
    }
    return (
      <div className="container-nft-fullPrice">
        <div className="description description-price description-price-unlockables-page">
          {`${minPrice} – ${maxPrice}`}
        </div>
        <div className="description description-price description-price-unlockables-page">
          {`${chainData[blockchain]?.symbol}`}
        </div>
      </div>
    );
  }

  function ifPriseSame() {
    if (minPrice === maxPrice) {
      if (minPrice.length > 5) {
        return `${minPrice.slice(0, 5)} ${chainData[blockchain]?.symbol}`;
      }
      return `${minPrice} ${chainData[blockchain]?.symbol}`;
    } else if (maxPrice && minPrice) {
      if (minPrice.length > 5) {
        return `${minPrice.slice(0, 5) + '+'} ${chainData[blockchain]?.symbol}`;
      }
      return `${minPrice + '+'} ${chainData[blockchain]?.symbol}`;
    }
  }

  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  useEffect(() => {
    getProductAsync();
  }, [getProductAsync]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

  return (
    <>
      <div className="col-12 p-1 col-sm-6 col-md-4 col-lg-3 text-start video-wrapper nft-item-collection">
        <div
          onClick={() => {
            if (!metaDataProducts?.metadata?.animation_url) RedirectToMockUp();
          }}
          className="col-12 rounded"
          style={{
            top: 0,
            position: 'relative',
            height: '100%',
            width: '100%',
            cursor: 'pointer'
          }}>
          {metaDataProducts?.metadata?.animation_url &&
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
          {metaDataProducts?.metadata?.animation_url ? (
            isFileUrl === 'gif' ? (
              <img
                alt="thumbnail"
                src={
                  metaDataProducts?.metadata?.animation_url
                    ? metaDataProducts?.metadata?.animation_url
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
            ) : (
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                <ReactPlayer
                  alt="thumbnail"
                  url={`${metaDataProducts.metadata?.animation_url}`}
                  light={
                    metaDataProducts.metadata?.image
                      ? metaDataProducts.metadata?.image
                      : pict
                  }
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
                metaDataProducts?.metadata?.image
                  ? metaDataProducts?.metadata?.image
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
          {<SvgKey color={'white'} bgColor={'rgba(34, 32, 33, 0.5)'} />}
          <div className="col description-wrapper pic-description-wrapper">
            <div className="description-title">
              <div
                className="description-item-name"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                {collectionName.slice(0, 14)}
                {collectionName.length > 12 ? '...' : ''}
                <div className="brief-info-nftItem">
                  <div>
                    {accountData ? (
                      <div className="collection-block-user-creator">
                        <img
                          src={
                            accountData.avatar
                              ? accountData.avatar
                              : defaultAvatar
                          }
                          alt="user"
                        />
                        <h5 style={{ wordBreak: 'break-all' }}>
                          {accountData.nickName
                            ? accountData.nickName.length > 16
                              ? accountData.nickName.slice(0, 5) +
                                '...' +
                                accountData.nickName.slice(
                                  accountData.nickName.length - 4
                                )
                              : accountData.nickName
                            : ownerCollectionUser.slice(0, 5) +
                              '...' +
                              ownerCollectionUser.slice(
                                ownerCollectionUser.length - 4
                              )}
                        </h5>
                      </div>
                    ) : (
                      <div className="collection-block-user-creator">
                        <img src={defaultAvatar} alt="user" />
                        <h5 style={{ wordBreak: 'break-all' }}>
                          {ownerCollectionUser &&
                            ownerCollectionUser.slice(0, 5) +
                              '....' +
                              ownerCollectionUser.slice(
                                ownerCollectionUser.length - 4
                              )}
                        </h5>
                      </div>
                    )}
                  </div>
                  <div className="collection-block-price">
                    <img
                      className="blockchain-img"
                      src={`${chainData[blockchain]?.image}`}
                      alt="blockchain-img"
                    />
                    <span className="description">{ifPriseSame()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={RedirectToMockUp} className="description-big">
              <img
                className="blockchain-img"
                src={`${chainData[blockchain]?.image}`}
                alt="blockchain-img"
              />
              <span className="description description-price">
                {checkPrice()}
              </span>
              <span className="description-more">View item</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const NftItem = memo(NftItemComponent);
