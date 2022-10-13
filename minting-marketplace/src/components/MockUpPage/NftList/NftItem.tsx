import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { utils } from 'ethers';
import { useStateIfMounted } from 'use-state-if-mounted';

import { INftItemComponent } from './nftList.types';
import { SvgKey } from './SvgKey';

import {
  TNftItemResponse,
  TTokenData,
  TUserResponse
} from '../../../axios.responseTypes';
import { UserType } from '../../../ducks/users/users.types';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import chainData from '../../../utils/blockchainData';
import { ImageLazy } from '../ImageLazy/ImageLazy';

import defaultAvatar from './../../UserProfileSettings/images/defaultUserPictures.png';
import { gettingPrice } from './utils/gettingPrice';

const NftItemComponent: React.FC<INftItemComponent> = ({
  blockchain,
  price,
  pict,
  contractName,
  collectionIndexInContract,
  collectionName,
  ownerCollectionUser
}) => {
  const navigate = useNavigate();
  const [metaDataProducts, setMetaDataProducts] = useStateIfMounted<
    TTokenData | undefined
  >(undefined);
  const [accountData, setAccountData] = useStateIfMounted<UserType | null>(
    null
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [isFileUrl, setIsFileUrl] = useState<string>();

  const { width } = useWindowDimensions();

  const { maxPrice, minPrice } = gettingPrice(price);

  const mobileFont = width > 400 ? '' : { fontSize: '9px' };
  const checkUrl = useCallback(() => {
    if (
      metaDataProducts &&
      metaDataProducts.metadata &&
      metaDataProducts.metadata.animation_url
    ) {
      const fileUrl: string | undefined =
        metaDataProducts.metadata?.animation_url;
      const parts: string[] | undefined = fileUrl?.split('/').pop()?.split('.');
      const ext: string | undefined =
        parts && parts?.length > 1 ? parts?.pop() : '';
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
        blockchain && chainData[blockchain]?.symbol
      }`;
    }
    return (
      <div className="container-nft-fullPrice">
        <div className="description description-price description-price-unlockables-page">
          {`${minPrice} – ${maxPrice}`}
        </div>
        <div className="description description-price description-price-unlockables-page">
          {`${blockchain && chainData[blockchain]?.symbol}`}
        </div>
      </div>
    );
  }

  function ifPriseSame() {
    if (minPrice === maxPrice) {
      if (minPrice.length > 5) {
        return `${minPrice.slice(0, 5)} ${
          blockchain && chainData[blockchain]?.symbol
        }`;
      }
      return `${minPrice} ${blockchain && chainData[blockchain]?.symbol}`;
    } else if (maxPrice && minPrice) {
      if (minPrice.length > 5) {
        return `${minPrice.slice(0, 5) + '+'} ${
          blockchain && chainData[blockchain]?.symbol
        }`;
      }
      return `${minPrice + '+'} ${blockchain && chainData[blockchain]?.symbol}`;
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
      <div className="text-start video-wrapper nft-item-collection mobile-respinsove">
        <div
          onClick={() => {
            if (!metaDataProducts?.metadata?.animation_url) RedirectToMockUp();
          }}
          className="col-12 rounded font-size"
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
              <ImageLazy
                className="col-12 h-100 w-100 zoom-event"
                width={'282px'}
                height={'282px'}
                alt={collectionName}
                src={
                  metaDataProducts?.metadata?.animation_url
                    ? metaDataProducts?.metadata?.animation_url
                    : pict
                }
              />
            ) : (
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                <ReactPlayer
                  alt={collectionName}
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
            <ImageLazy
              className="col-12 h-100 w-100 zoom-event"
              width={'282px'}
              height={'282px'}
              src={
                metaDataProducts?.metadata?.image
                  ? metaDataProducts?.metadata?.image
                  : pict
              }
              alt={collectionName}
            />
          )}
          {
            <SvgKey
              color={'white'}
              bgColor={'rgba(34, 32, 33, 0.5)'}
              mobile={width > 700 ? false : true}
            />
          }
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
                          alt="User Avatar"
                        />
                        <h5 style={{ wordBreak: 'break-all', ...mobileFont }}>
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
                        <img src={defaultAvatar} alt="User Avatar" />
                        <h5 style={{ wordBreak: 'break-all', ...mobileFont }}>
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
                      src={`${blockchain && chainData[blockchain]?.image}`}
                      alt="Blockchain network"
                    />
                    <span className="description">
                      {ifPriseSame()?.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={RedirectToMockUp} className="description-big">
              <img
                className="blockchain-img"
                src={`${blockchain && chainData[blockchain]?.image}`}
                alt="Blockchain network"
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
