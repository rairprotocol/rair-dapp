import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate, useParams } from 'react-router-dom';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import useIPFSImageLink from '../../../hooks/useIPFSImageLink';
import chainData from '../../../utils/blockchainData';
import { checkIPFSanimation } from '../../../utils/checkIPFSanimation';
import { getRGBValue } from '../../../utils/determineColorRange';
import { rFetch } from '../../../utils/rFetch';
import defaultImage from '../../UserProfileSettings/images/defaultUserPictures.png';
import { ImageLazy } from '../ImageLazy/ImageLazy';
import {
  INftItemForCollectionView,
  TParamsNftItemForCollectionView
} from '../mockupPage.types';

import { gettingPrice } from './utils/gettingPrice';

const NftItemForCollectionViewComponent: React.FC<
  INftItemForCollectionView
> = ({
  embeddedParams,
  blockchain,
  pict,
  offerPrice,
  index,
  indexId,
  metadata,
  offer,
  selectedData,
  someUsersData,
  userName,
  tokenDataLength,
  setPlaying,
  playing,
  diamond,
  offerData,
  offerItemData,
  id,
  item
}) => {
  const params = useParams<TParamsNftItemForCollectionView>();
  const navigate = useNavigate();

  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();
  const ipfsLink = useIPFSImageLink(metadata?.image);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const rgbValue = getRGBValue(diamond, offer, offerData, indexId);

  const handlePlaying = (el?: unknown) => {
    if (el === null) {
      setPlaying(null);
    } else {
      setPlaying(indexId);
    }
  };

  const toggleVideoPlay = () => {
    if (playing === indexId) {
      setPlaying(null);
    } else {
      setPlaying(indexId);
    }
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

      if (offerItemData) {
        const rawPrice = BigNumber.from(
          offerItemData.price ? offerItemData.price : 0
        );
        const price = rawPrice.lte(100000) ? '0.000+' : formatEther(rawPrice);

        return price;
      }

      // if (maxPrice && minPrice) {
      //   return `${minPrice} – ${maxPrice} ${
      //     blockchain && chainData[blockchain]?.symbol
      //   }`;
      // }
    }
  }

  const getTokenData = useCallback(async () => {
    if (item) {
      const response = await rFetch(
        `/api/v2/tokens/${item._id}`,
        undefined,
        undefined,
        undefined
      );

      if (response.success) {
        setTokenInfo(response.tokenData);
      }
    }
  }, [item]);

  const redirectionUserPage = useCallback(() => {
    if (tokenInfo && tokenInfo.contract && tokenInfo.product) {
      navigate(
        `/tokens/${tokenInfo.contract.blockchain}/${tokenInfo.contract.contractAddress}/${tokenInfo.product.collectionIndexInContract}/${tokenInfo.token}`
      );
    }
  }, [navigate, tokenInfo]);

  let className = 'col-12 text-start video-wrapper nft-item-collection';

  if (tokenDataLength && tokenDataLength < 4) {
    className += ' standartSize';
  }

  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  useEffect(() => {
    getTokenData();
  }, [getTokenData]);

  return (
    <>
      {offer && (
        // <div className="nft-item-collection grid-item">
        <div className="nft-item-collection grid-item" id={id}>
          <div
            onClick={() => {
              if (
                !metadata?.animation_url ||
                isFileUrl === 'gif' ||
                isFileUrl === 'png' ||
                isFileUrl === 'jpeg' ||
                isFileUrl === 'webp'
              )
                if (!item) {
                  RedirectToMockUp();
                }
            }}
            className="rounded"
            style={{
              top: 0,
              position: 'relative',
              height: '100%',
              width: '100%',
              cursor: 'pointer',
              borderRadius: '16px'
            }}>
            {metadata?.animation_url &&
              (isFileUrl === 'gif' ||
              isFileUrl === 'png' ||
              isFileUrl === 'jpeg' ||
              isFileUrl === 'webp' ? (
                <></>
              ) : playing === indexId ? (
                <div
                  className="btn-play"
                  onClick={() => {
                    handlePlaying(null);
                  }}>
                  <div>
                    <i className="fas fa-pause"></i>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    handlePlaying();
                  }}
                  className="btn-play">
                  <div>
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              ))}
            {metadata?.animation_url ? (
              isFileUrl === 'gif' ||
              isFileUrl === 'png' ||
              isFileUrl === 'jpeg' ||
              isFileUrl === 'webp' ? (
                <ImageLazy
                  cover={true}
                  className="col-12 h-100 w-100 zoom-event zoom-event"
                  width={'100%'}
                  height={'100%'}
                  alt={metadata?.name === 'none' ? 'NFT token' : metadata?.name}
                  src={metadata?.image ? metadata?.image : pict}
                />
              ) : (
                <div
                  style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '100%',
                    width: '100%'
                  }}>
                  <ReactPlayer
                    onClick={() => toggleVideoPlay()}
                    alt="metadata?.name === 'none' ? 'NFT token' : metadata?.name"
                    url={`${checkIPFSanimation(metadata?.animation_url)}`}
                    light={metadata?.image ? metadata?.image : pict}
                    style={{
                      // position: 'absolute',
                      bottom: 0,
                      borderRadius: '16px',
                      overflow: 'hidden'
                    }}
                    width={'100%'}
                    height={'100%'}
                    autoPlay={true}
                    onReady={handlePlaying}
                    playing={playing === indexId}
                    onEnded={() => handlePlaying(null)}
                  />
                </div>
              )
            ) : (
              <ImageLazy
                className="col-12 h-100 w-100 zoom-event"
                cover={true}
                width={'100%'}
                height={'100%'}
                alt={metadata?.name === 'none' ? 'NFT token' : metadata?.name}
                src={metadata?.image ? ipfsLink : pict}
              />
            )}
            {/* {diamond ? (
              <>
                {offerData && offerData[0] && (
                  <>
                    {BigNumber.from(indexId).gte(offerData[0].range[0]) &&
                      BigNumber.from(indexId).lte(offerData[0].range[1]) && (
                        // <SvgKey
                        //   key={index}
                        //   color={'#E4476D'}
                        //   bgColor={'rgba(34, 32, 33, 0.5)'}
                        // />
                        <></>
                      )}
                  </>
                )}
                {offerData && offerData[1] && (
                  <>
                    {BigNumber.from(indexId).gte(offerData[1].range[0]) &&
                      BigNumber.from(indexId).lte(offerData[1].range[1]) && (
                        // <SvgKey
                        //   color={'#CCA541'}
                        //   bgColor={'rgba(34, 32, 33, 0.5)'}
                        // />
                        <></>
                      )}
                  </>
                )}
                {offerData && offerData.length > 1 && (
                  <>
                    {offerData[2] &&
                      BigNumber.from(indexId).gte(offerData[2].range[0]) &&
                      offerData[2] &&
                      BigNumber.from(indexId).lte(offerData[2].range[1]) && (
                        // <SvgKey
                        //   color={'silver'}
                        //   bgColor={'rgba(34, 32, 33, 0.5)'}
                        // />
                        <></>
                      )}
                  </>
                )}
              </>
            ) : (
              <>
                {offer.toString() === '0' ? (
                  // <SvgKey color={'#E4476D'} bgColor={'rgba(34, 32, 33, 0.5)'} />
                  <></>
                ) : offer.toString() === '1' ? (
                  // <SvgKey color={'#CCA541'} bgColor={'rgba(34, 32, 33, 0.5)'} />
                  <></>
                ) : (
                  // <SvgKey color={'silver'} bgColor={'rgba(34, 32, 33, 0.5)'} />
                  <></>
                )}
              </>
            )} */}
            <div
              className="description-wrapper pic-description-wrapper wrapper-for-collection-view"
              style={{
                background: `linear-gradient(0deg, ${rgbValue} 0%, rgba(34,32,33,0.7357536764705883) 5%, rgba(34,32,33,0.671327906162465) 30%, rgba(255,255,255,0) 100%)`
              }}>
              <div className="description-title">
                <div
                  className="description-item-name"
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}>
                  {metadata?.name === 'none' && '#' + index}
                  {metadata?.name !== 'none' && metadata?.name.slice(0, 22)}
                  {metadata?.name !== 'none' && metadata?.name.length > 22
                    ? '...'
                    : ''}
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
                      {/* {checkPrice()} */}
                      {offerPrice && fullPrice()}
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  if (item) {
                    redirectionUserPage();
                  } else {
                    RedirectToMockUp();
                  }
                }}
                className="description-big">
                <div>
                  <img
                    className="blockchain-img"
                    src={`${blockchain && chainData[blockchain]?.image}`}
                    alt="Blockchain network"
                  />
                </div>
                <span className="description description-price description-price-unlockables-page">
                  {offerPrice && fullPrice()}
                </span>
                <span className="description-more">View item</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const NftItemForCollectionView = memo(NftItemForCollectionViewComponent);
