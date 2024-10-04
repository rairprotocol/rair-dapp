import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Provider, useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosError } from 'axios';
import { formatEther } from 'ethers';

import { IOffersResponseType } from '../../../axios.responseTypes';
import useIPFSImageLink from '../../../hooks/useIPFSImageLink';
import { useAppSelector } from '../../../hooks/useReduxHooks';
import useServerSettings from '../../../hooks/useServerSettings';
import useSwal from '../../../hooks/useSwal';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { BillTransferIcon, defaultHotDrops } from '../../../images';
import { checkIPFSanimation } from '../../../utils/checkIPFSanimation';
import { getRGBValue } from '../../../utils/determineColorRange';
import { rFetch } from '../../../utils/rFetch';
import ResaleModal from '../../nft/PersonalProfile/PersonalProfileMyNftTab/ResaleModal/ResaleModal';
import defaultImage from '../../UserProfileSettings/images/defaultUserPictures.png';
import { ImageLazy } from '../ImageLazy/ImageLazy';
import {
  INftItemForCollectionView,
  TParamsNftItemForCollectionView
} from '../mockupPage.types';

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
  setPlaying,
  playing,
  diamond,
  offerData,
  offerItemData,
  id,
  item,
  resaleFlag,
  resalePrice,
  getMyNft,
  totalNft,
  metadataFilter
}) => {
  const params = useParams<TParamsNftItemForCollectionView>();
  const navigate = useNavigate();
  const store = useStore();

  const { getBlockchainData } = useServerSettings();

  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();
  const ipfsLink = useIPFSImageLink(metadata?.image);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [offerDataUser, setOfferDataUser] = useState<any>();
  const [offerPriceUser, setOfferPriceUser] = useState<string[] | undefined>();
  const [selectedOfferIndexUser, setSelectedOfferIndexUser] = useState<any>();

  const { width } = useWindowDimensions();
  const isMobileDesign = width < 600;

  const { currentUserAddress, exchangeRates } = useAppSelector(
    (state) => state.web3
  );
  const { primaryColor } = useAppSelector((store) => store.colors);

  const { userAddress, contract, product } = useParams();

  const reactSwal = useSwal();

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
          `/tokens/${blockchain}/${params.contract}/${params.product}/${item.token}`
        );
      };

  const fullPrice = () => {
    if (offerPrice) {
      if (resalePrice) {
        return formatEther(resalePrice);
      }
      if (offerPrice.length > 0 && offerItemData) {
        const rawPrice = BigInt(offerItemData.price ? offerItemData.price : 0);
        const price =
          rawPrice < BigInt(100000) ? '0.000+' : formatEther(rawPrice);

        return price;
      }
    } else {
      if (offerPriceUser && offerPriceUser.length > 0) {
        if (offerDataUser) {
          if (offerDataUser.price && offerDataUser.price.length) {
            const rawPrice = BigInt(offerDataUser.price || 0);
            const price =
              rawPrice < BigInt(100000) ? '0.000+' : formatEther(rawPrice);

            return price;
          } else {
            const rawPrice = BigInt(
              offerDataUser.price ? offerDataUser.price : 0
            );
            const price =
              rawPrice < BigInt(100000) ? '0.000+' : formatEther(rawPrice);

            return price;
          }
        }
      }
    }
  };

  const getTokenData = useCallback(async () => {
    if (!contract && item) {
      const response = await rFetch(
        `/api/tokens/id/${item._id}`,
        undefined,
        undefined,
        undefined
      );
      if (response.success) {
        setTokenInfo(response.tokenData);
      }
    }
  }, [item, contract]);

  const redirectionFromUserPage = useCallback(() => {
    const tokenContract =
      contract ||
      item?.contract?.contractAddress ||
      tokenInfo?.contract?.contractAddress;
    const tokenBlockchain =
      blockchain ||
      item?.contract?.blockchain ||
      tokenInfo?.contract?.blockchain;
    const tokenProduct =
      product || tokenInfo?.product?.collectionIndexInContract;
    const tokenIndex = index || tokenInfo.token;
    if (tokenContract && tokenBlockchain && tokenProduct && tokenIndex) {
      navigate(
        `/tokens/${tokenBlockchain}/${tokenContract}/${tokenProduct}/${tokenIndex}`
      );
    }
  }, [navigate, tokenInfo, contract, blockchain, product, index, item]);

  const initialTokenData = useCallback(() => {
    if (item && resaleFlag) {
      if (item.contract?.diamond) {
        setSelectedOfferIndexUser(item && item?.offer);
      } else {
        setSelectedOfferIndexUser(item && item?.offer);
      }
    }
  }, [item, resaleFlag]);

  const getParticularOffer = useCallback(async () => {
    if (resaleFlag && !resalePrice && tokenInfo) {
      try {
        const response = await axios.get<IOffersResponseType>(
          `/api/nft/network/${tokenInfo.contract.blockchain}/${tokenInfo.contract.contractAddress}/${tokenInfo.product.collectionIndexInContract}/offers`
        );
        const resaleResponse = await rFetch(
          `/api/resales/open?contract=${item.contract.contractAddress}&blockchain=${item.contract.blockchain}&index=${item.uniqueIndexInContract}`
        );

        if (response.data.success) {
          const offerInformation = response.data.product.offers?.find(
            (neededOfferIndex) => {
              const offerIndex = neededOfferIndex.diamond
                ? neededOfferIndex.diamondRangeIndex
                : neededOfferIndex.offerIndex;
              return (
                selectedOfferIndexUser.toString() === offerIndex?.toString()
              );
            }
          );
          if (resaleResponse.data.length) {
            setOfferDataUser({
              ...offerInformation,
              price: resaleResponse.data[0].price.toString()
            });
          } else {
            setOfferDataUser(offerInformation);
          }

          if (resaleResponse.success && resaleResponse.data.length) {
            setOfferPriceUser(
              resaleResponse.data.map((p) => {
                return p.price.toString();
              })
            );
          } else {
            setOfferPriceUser(
              response.data.product.offers?.map((p) => {
                return p.price.toString();
              })
            );
          }
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error(error?.message);
      }
    }
  }, [item, resaleFlag, selectedOfferIndexUser, tokenInfo, resalePrice]);

  useEffect(() => {
    initialTokenData();
  }, [initialTokenData]);

  useEffect(() => {
    getParticularOffer();
  }, [getParticularOffer]);

  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  useEffect(() => {
    getTokenData();
  }, [getTokenData]);

  const displayImage = metadata?.image_thumbnail
    ? metadata.image_thumbnail
    : ipfsLink
      ? ipfsLink
      : import.meta.env.VITE_TESTNET === 'true'
        ? defaultHotDrops
        : pict;

  return (
    <>
      {offer && (
        // <div className="nft-item-collection grid-item">
        <div
          onClick={() => {
            if (
              (!resaleFlag && !metadata?.animation_url) ||
              isFileUrl === 'gif' ||
              isFileUrl === 'png' ||
              isFileUrl === 'jpeg' ||
              isFileUrl === 'webp'
            ) {
              RedirectToMockUp();
            }

            if (item && !resaleFlag && item.isMinted && !resalePrice) {
              RedirectToMockUp();
            }
          }}
          className={`nft-item-collection grid-item ${
            metadataFilter && 'with-modal'
          }`}
          id={id}>
          <>
            {item && resaleFlag && currentUserAddress === userAddress && (
              <button
                onClick={() => {
                  reactSwal.fire({
                    html: (
                      <Provider store={store}>
                        <ResaleModal
                          item={item}
                          getMyNft={getMyNft}
                          totalNft={totalNft}
                        />
                      </Provider>
                    ),
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
          </>
          <div
            onClick={() => {
              if (
                !metadata?.animation_url ||
                isFileUrl === 'gif' ||
                isFileUrl === 'png' ||
                isFileUrl === 'jpeg' ||
                isFileUrl === 'webp'
              )
                if (!resaleFlag) {
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
                    <FontAwesomeIcon icon={faPause} />
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    handlePlaying();
                  }}
                  className="btn-play">
                  <div>
                    <FontAwesomeIcon icon={faPlay} />
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
                  src={displayImage}
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
                    light={displayImage}
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
                src={displayImage}
              />
            )}

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
                  {metadata?.name !== 'none' &&
                  isMobileDesign &&
                  metadata?.name.length > 16
                    ? metadata?.name.slice(0, 16) + '...'
                    : metadata?.name.length > 22
                      ? metadata?.name.slice(0, 22) + '...'
                      : metadata?.name}
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
                      {item?.isMinted && item.ownerData ? (
                        <div className="collection-block-user-creator">
                          <img
                            src={
                              item.ownerData?.avatar
                                ? item.ownerData?.avatar
                                : defaultImage
                            }
                            alt="User Avatar"
                          />
                          <h5 style={{ wordBreak: 'break-all' }}>
                            {item.ownerData?.nickName
                              ? item.ownerData?.nickName.length > 16
                                ? item.ownerData?.nickName.slice(0, 5) +
                                  '...' +
                                  item.ownerData?.nickName.slice(
                                    item.ownerData?.nickName.length - 4
                                  )
                                : item.ownerData?.nickName
                              : userName?.slice(0, 5) +
                                '....' +
                                userName?.slice(userName.length - 4)}
                          </h5>
                        </div>
                      ) : someUsersData ? (
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
                    {item && !resaleFlag && item.isMinted && !resalePrice && (
                      <div className="nft-item-collection-sold-out">
                        <div className="sold-out-box">Sold out</div>
                      </div>
                    )}
                    <div
                      className="collection-block-price"
                      style={{ alignItems: 'flex-end' }}>
                      <img
                        src={blockchain && getBlockchainData(blockchain)?.image}
                        alt="Blockchain network"
                      />
                      {fullPrice()}
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  if (item) {
                    redirectionFromUserPage();
                  } else {
                    RedirectToMockUp();
                  }
                }}
                className="description-big">
                <div>
                  <img
                    className="blockchain-img"
                    src={`${
                      blockchain && getBlockchainData(blockchain)?.image
                    }`}
                    alt="Blockchain network"
                  />
                </div>
                <span className="description description-price description-price-unlockables-page">
                  {fullPrice()}
                </span>
                {exchangeRates && blockchain && !!exchangeRates[blockchain] && (
                  <span className="description-usd-price-collection-page">
                    {resaleFlag
                      ? (
                          Number(resalePrice) *
                          Number(exchangeRates[blockchain])
                        ).toFixed(2) !== 'NaN'
                        ? `$${(
                            Number(resalePrice) *
                            Number(exchangeRates[blockchain])
                          ).toFixed(2)}`
                        : 0.0
                      : fullPrice() !== '0.000+' &&
                          (
                            Number(fullPrice()) *
                            Number(exchangeRates[blockchain])
                          ).toFixed(2) !== 'NaN'
                        ? `$${(
                            Number(fullPrice()) *
                            Number(exchangeRates[blockchain])
                          ).toFixed(2)}`
                        : 0.0}
                  </span>
                )}
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
