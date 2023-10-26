import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Provider, useSelector, useStore } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BigNumber, constants, utils } from 'ethers';
import { formatEther } from 'ethers/lib/utils';

import { TUserResponse } from '../../../axios.responseTypes';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { UserType } from '../../../ducks/users/users.types';
import useIPFSImageLink from '../../../hooks/useIPFSImageLink';
import useSwal from '../../../hooks/useSwal';
import { BillTransferIcon } from '../../../images';
import chainData from '../../../utils/blockchainData';
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
  usdPrice
}) => {
  const params = useParams<TParamsNftItemForCollectionView>();
  const navigate = useNavigate();
  const store = useStore();

  const [userInfoMinted, setUserInfoMinted] = useState<UserType | null>(null);
  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();
  const ipfsLink = useIPFSImageLink(metadata?.image);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (state) => state.contractStore
  );
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

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
          `/tokens/${blockchain}/${params.contract}/${params.product}/${index}`
        );
      };

  function fullPrice() {
    if (offerPrice && offerPrice.length > 0) {
      if (offerItemData) {
        const rawPrice = BigNumber.from(
          offerItemData.price ? offerItemData.price : 0
        );
        const price = rawPrice.lte(100000) ? '0.000+' : formatEther(rawPrice);

        return price;
      }
    }
  }

  const getTokenData = useCallback(async () => {
    if (!contract && item) {
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
  }, [item, contract]);

  const redirectionUserPage = useCallback(() => {
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

  const getInfoFromUser = useCallback(async () => {
    // find user
    if (
      item &&
      utils.isAddress(item.ownerAddress) &&
      item.ownerAddress !== constants.AddressZero
    ) {
      const result = await axios
        .get<TUserResponse>(`/api/users/${item.ownerAddress}`)
        .then((res) => res.data);
      setUserInfoMinted(result.user);
    }
  }, [item]);

  useEffect(() => {
    getInfoFromUser();
  }, [getInfoFromUser]);

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
          className="nft-item-collection grid-item"
          id={id}>
          {item && !resaleFlag && item.isMinted && !resalePrice && (
            <div className="nft-item-collection-sold-out">
              <div className="sold-out-box">Sold out</div>
            </div>
          )}
          <>
            {item && resaleFlag && currentUserAddress === userAddress && (
              <button
                onClick={() => {
                  reactSwal.fire({
                    html: (
                      <Provider store={store}>
                        <ResaleModal textColor={textColor} item={item} />
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
                      {item?.isMinted && userInfoMinted ? (
                        <div className="collection-block-user-creator">
                          <img
                            src={
                              userInfoMinted.avatar
                                ? userInfoMinted.avatar
                                : defaultImage
                            }
                            alt="User Avatar"
                          />
                          <h5 style={{ wordBreak: 'break-all' }}>
                            {userInfoMinted.nickName
                              ? userInfoMinted.nickName.length > 16
                                ? userInfoMinted.nickName.slice(0, 5) +
                                  '...' +
                                  userInfoMinted.nickName.slice(
                                    userInfoMinted.nickName.length - 4
                                  )
                                : userInfoMinted.nickName
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
                    <div
                      className="collection-block-price"
                      style={{ alignItems: 'flex-end' }}>
                      <img
                        src={blockchain && chainData[blockchain]?.image}
                        alt="Blockchain network"
                      />
                      {resalePrice !== undefined
                        ? resalePrice
                        : offerPrice && fullPrice()}
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
                  {resalePrice !== undefined
                    ? resalePrice
                    : offerPrice && fullPrice()}
                </span>
                {usdPrice && (
                  <span className="description-usd-price-collection-page">
                    {usdPrice && resalePrice !== undefined
                      ? `$${(Number(resalePrice) * Number(usdPrice)).toFixed(
                          4
                        )}`
                      : offerPrice &&
                        `$${(Number(fullPrice()) * Number(usdPrice)).toFixed(
                          4
                        )}`}
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
