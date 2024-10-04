import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INftItemComponent } from './nftList.types';

import useIPFSImageLink from '../../../hooks/useIPFSImageLink';
import useServerSettings from '../../../hooks/useServerSettings';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { defaultHotDrops } from '../../../images';
import {
  GlobalModalContext,
  TGlobalModalContext
} from '../../../providers/ModalProvider';
import { checkIPFSanimation } from '../../../utils/checkIPFSanimation';
import { ImageLazy } from '../ImageLazy/ImageLazy';

import defaultAvatar from './../../UserProfileSettings/images/defaultUserPictures.png';
import { gettingPrice } from './utils/gettingPrice';

const NftItemComponent: React.FC<INftItemComponent> = ({
  item,
  index,
  playing,
  setPlaying,
  className
}) => {
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const { getBlockchainData } = useServerSettings();

  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('0');
  const [isFileUrl, setIsFileUrl] = useState<string>();

  useEffect(() => {
    const { maxPrice, minPrice } = gettingPrice(
      item.product.offers.map((offer) => offer.price)
    );
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  }, [item.product.offers]);

  const chainInfo = getBlockchainData(item.blockchain);
  const ipfsLink = useIPFSImageLink(item.frontToken.metadata.image);

  const { globalModalState } =
    useContext<TGlobalModalContext>(GlobalModalContext);

  const mobileFont = width > 400 ? '' : { fontSize: '9px' };

  const checkUrl = useCallback(() => {
    if (item?.frontToken?.metadata?.animation_url) {
      const fileUrl: string | undefined =
        item?.frontToken?.metadata?.animation_url;
      const parts: string[] | undefined = fileUrl?.split('/').pop()?.split('.');
      const ext: string | undefined =
        parts && parts?.length > 1 ? parts?.pop() : '';
      setIsFileUrl(ext);
    }
  }, [item?.frontToken?.metadata?.animation_url]);

  const handlePlaying = (el?: unknown) => {
    if (el === null) {
      setPlaying(null);
    } else {
      setPlaying(index);
    }
  };

  const toggleVideoPlay = () => {
    if (playing === index) {
      setPlaying(null);
    } else {
      setPlaying(index);
    }
  };

  const navigateToCollectionPage = () => {
    navigate(
      `/collection/${item.blockchain}/${item.contractAddress}/${item.product.collectionIndexInContract}/0`
    );
  };

  const checkPrice = useCallback(() => {
    const symbol = chainInfo?.symbol;
    const minimumPrice =
      minPrice.length > 8 ? `${Number(minPrice).toFixed(4)}+` : minPrice;
    const maximumPrice =
      maxPrice.length > 8 ? `${Number(maxPrice).toFixed(4)}+` : maxPrice;
    return (
      <div className="container-nft-fullPrice">
        <div className="description description-price description-price-unlockables-page">
          {minimumPrice}{' '}
          {maximumPrice !== minimumPrice ? `- ${maximumPrice}` : ''}
        </div>
        {symbol && (
          <div className="description description-price description-price-unlockables-page">
            {symbol}
          </div>
        )}
      </div>
    );
  }, [maxPrice, minPrice, chainInfo?.symbol]);

  function ifPriseSame() {
    if (minPrice === maxPrice) {
      if (minPrice.length > 5) {
        return `${minPrice.slice(0, 5)} ${item.blockchain && chainInfo?.symbol}`;
      }
      return `${minPrice} ${item.blockchain && chainInfo?.symbol}`;
    } else if (maxPrice && minPrice) {
      if (minPrice.length > 5) {
        return `${minPrice.slice(0, 5) + '+'} ${
          item.blockchain && chainInfo?.symbol
        }`;
      }
      return `${minPrice + '+'} ${item.blockchain && chainInfo?.symbol}`;
    }
  }
  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  const displayImage = item.frontToken?.metadata?.image_thumbnail
    ? item.frontToken.metadata.image_thumbnail
    : ipfsLink
      ? ipfsLink
      : import.meta.env.VITE_TESTNET === 'true'
        ? defaultHotDrops
        : item.product.cover;

  return (
    <>
      <div
        className={`${
          className
            ? `${className} nft-item-collection`
            : `text-start video-wrapper nft-item-collection ${
                width < 701 ? 'grid-item' : ''
              } mobile-respinsove ${
                globalModalState?.isOpen ? 'with-modal' : ''
              }`
        }`}>
        <div
          onClick={() => {
            if (
              !item.frontToken?.metadata?.animation_url ||
              isFileUrl === 'gif' ||
              isFileUrl === 'png' ||
              isFileUrl === 'jpeg' ||
              isFileUrl === 'webp'
            )
              navigateToCollectionPage();
          }}
          className="col-12 rounded font-size"
          style={{
            top: 0,
            position: 'relative',
            height: '100%',
            width: '100%',
            cursor: 'pointer'
          }}>
          {item.frontToken?.metadata?.animation_url &&
            (isFileUrl === 'gif' ||
            isFileUrl === 'png' ||
            isFileUrl === 'jpeg' ||
            isFileUrl === 'webp' ? (
              <></>
            ) : playing === index ? (
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
                  <FontAwesomeIcon icon={faPause} />
                </div>
              </div>
            ))}
          {item.frontToken?.metadata?.animation_url ? (
            isFileUrl === 'gif' ||
            isFileUrl === 'png' ||
            isFileUrl === 'jpeg' ||
            isFileUrl === 'webp' ? (
              <ImageLazy
                className="col-12 h-100 w-100 zoom-event"
                width={'282px'}
                height={'282px'}
                alt={item.product.name}
                cover={true}
                src={displayImage}
              />
            ) : (
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}>
                {
                  <ReactPlayer
                    onClick={() => toggleVideoPlay()}
                    alt={item.product.name}
                    url={`${checkIPFSanimation(
                      item.frontToken.metadata?.animation_url
                    )}`}
                    light={displayImage}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      borderRadius: '16px',
                      overflow: 'hidden'
                    }}
                    autoPlay={true}
                    className="col-12 h-100 w-100"
                    onReady={handlePlaying}
                    playing={playing === index}
                    onEnded={() => handlePlaying(null)}
                  />
                }
              </div>
            )
          ) : (
            <ImageLazy
              className="col-12 h-100 w-100 zoom-event"
              width={'282px'}
              height={'282px'}
              src={displayImage}
              alt={item.product.name}
              cover={true}
            />
          )}
          {/* {
            <SvgKey
              color={'white'}
              bgColor={'rgba(34, 32, 33, 0.5)'}
              mobile={width > 700 ? false : true}
            />
          } */}
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
                {item.product.name.slice(0, 14)}
                {item.product.name.length > 12 ? '...' : ''}
                <div className="brief-info-nftItem">
                  <div>
                    {item.userData ? (
                      <div className="collection-block-user-creator">
                        <img
                          src={
                            item.userData.avatar
                              ? item.userData.avatar
                              : defaultAvatar
                          }
                          alt="User Avatar"
                        />
                        <h5 style={{ wordBreak: 'break-all', ...mobileFont }}>
                          {item.userData.nickName
                            ? item.userData.nickName.length > 16
                              ? item.userData.nickName.slice(0, 5) +
                                '...' +
                                item.userData.nickName.slice(
                                  item.userData.nickName.length - 4
                                )
                              : item.userData.nickName
                            : item.user.slice(0, 5) +
                              '...' +
                              item.user.slice(item.user.length - 4)}
                        </h5>
                      </div>
                    ) : (
                      <div className="collection-block-user-creator">
                        <img src={defaultAvatar} alt="User Avatar" />
                        <h5 style={{ wordBreak: 'break-all', ...mobileFont }}>
                          {item.user &&
                            item.user.slice(0, 5) +
                              '...' +
                              item.user.slice(item.user.length - 4)}
                        </h5>
                      </div>
                    )}
                  </div>
                  <div className="collection-block-price">
                    <img
                      className="blockchain-img"
                      src={`${item.blockchain && chainInfo?.image}`}
                      alt="Blockchain network"
                    />
                    <span className="description">
                      {ifPriseSame()?.split(' ')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div onClick={navigateToCollectionPage} className="description-big">
              <img
                className="blockchain-img"
                src={`${item.blockchain && chainInfo?.image}`}
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
