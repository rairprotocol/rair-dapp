import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import EtherscanIconComponent from './EtherscanIconComponent';
import SerialNumberBuySell from './SerialNumberBuySell';
import SingleTokenViewProperties from './SingleTokenViewProperties';
import { TitleSingleTokenView } from './TitleSingleTokenView';
import UnlockableVideosSingleTokenPage from './UnlockableVideosSingleTokenPage';

import useIPFSImageLink from '../../../../hooks/useIPFSImageLink';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../hooks/useReduxHooks';
import { ExpandImageIcon } from '../../../../images';
import { tokenNumbersResponse } from '../../../../types/apiResponseTypes';
import { CatalogVideoItem } from '../../../../types/commonTypes';
import { checkIPFSanimation } from '../../../../utils/checkIPFSanimation';
import setDocumentTitle from '../../../../utils/setTitle';
import LoadingComponent from '../../../common/LoadingComponent';
import PlayCircle from '../../assets/PlayCircle.svg?react';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import { INftDataPageMain, TOffersIndexesData } from '../../mockupPage.types';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import { changeIPFSLink } from '../utils/changeIPFSLink';

import TitleCollection from './TitleCollection/TitleCollection';

const NftDataPageMain: React.FC<INftDataPageMain> = ({
  blockchain,
  contract,
  handleClickToken,
  product,
  productsFromOffer,
  selectedData,
  selectedToken,
  setSelectedToken,
  offerData,
  offerDataInfo,
  someUsersData,
  ownerInfo,
  embeddedParams,
  setTokenNumber
}) => {
  const { currentCollection } = useAppSelector((state) => state.tokens);
  const { tokenId } = useParams();

  const [selectVideo, setSelectVideo] = useState<
    CatalogVideoItem | undefined
  >();
  const [openVideoplayer, setOpenVideoPlayer] = useState<boolean>(false);
  const [verticalImage, setVerticalImage] = useState(false);
  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();
  const myRef = useRef(null);
  const hotdropsVar = import.meta.env.VITE_TESTNET === 'true';
  const [serialNumberData, setSerialNumberData] = useState<any>([]);
  const [playing, setPlaying] = useState<boolean>(false);
  const [, /*offersIndexesData*/ setOffersIndexesData] =
    useState<TOffersIndexesData[]>();
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const { primaryColor, isDarkMode } = useAppSelector((store) => store.colors);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (productsFromOffer) {
      setSelectVideo(productsFromOffer[0]);
    }
  }, [setSelectVideo, productsFromOffer]);

  const checkUrl = useCallback(() => {
    if (selectedData && selectedData.animation_url) {
      const fileUrl = selectedData?.animation_url;
      const parts = fileUrl.split('/').pop()?.split('.');
      const ext = parts && parts.length > 1 ? parts?.pop() : '';
      setIsFileUrl(ext);
    }
  }, [selectedData, setIsFileUrl]);

  const ipfsLink = useIPFSImageLink(selectedData?.image);

  const imageSize = (url) => {
    const img = document.createElement('img');

    const promise = new Promise((resolve, reject) => {
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        resolve({ width, height });
      };

      img.onerror = reject;
    });

    img.src = url;

    return promise;
  };

  const checkSizeImage = useCallback(async () => {
    if (selectedData?.image) {
      try {
        const res: any = await imageSize(selectedData?.image);

        if (res.width > res.height) {
          setVerticalImage(true);
        } else {
          setVerticalImage(false);
        }
      } catch (e) {
        setVerticalImage(false);
      }
    }
  }, [selectedData]);

  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  const handlePlayerClick = () => {
    setOpenVideoPlayer(true);
  };

  const fetchSerialNumberData = useCallback(async () => {
    const { data } = await axios.get<tokenNumbersResponse>(
      `/api/nft/network/${blockchain}/${contract}/${product}/numbers`
    );

    if (data.success && data?.tokens) {
      setSerialNumberData(data.tokens);
    }
  }, [blockchain, contract, product]);

  useEffect(() => {
    fetchSerialNumberData();
  }, [fetchSerialNumberData]);

  useEffect(() => {
    checkSizeImage();
  }, [checkSizeImage]);

  useEffect(() => {
    if (!embeddedParams) {
      window.scroll(0, 0);
    }
  }, [embeddedParams]);

  useEffect(() => {
    setDocumentTitle('Single Token');
  }, [dispatch]);

  useEffect(() => {
    if (offerDataInfo !== undefined && offerDataInfo.length) {
      const first = offerDataInfo.map((r) => {
        return {
          copies: r.copies,
          soldCopies: r.soldCopies,
          offerIndex: r.offerIndex,
          range: r.range
        };
      });
      setOffersIndexesData(
        first.map((e, index) => {
          return {
            pkey:
              e.offerIndex === '0' ? (
                <FontAwesomeIcon icon={faKey} style={{ color: 'red' }} />
              ) : e.offerIndex === '1' ? (
                '🔑'
              ) : (
                <FontAwesomeIcon icon={faKey} style={{ color: 'silver' }} />
              ),
            value:
              e.offerIndex === '0'
                ? 'Ultra Rair'
                : e.offerIndex === '1'
                  ? 'Rair'
                  : 'Common',
            id: index,
            copies: e.copies,
            soldCopies: e.soldCopies,
            range: e.range
          };
        })
      );
    }
  }, [offerDataInfo]);

  useEffect(() => {
    if (selectedToken && setTokenNumber) {
      setTokenNumber(Number(selectedToken));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToken]);

  if (!selectedData?.name || !tokenId) {
    return <LoadingComponent />;
  }

  return (
    <main ref={myRef} id="nft-data-page-wrapper">
      <BreadcrumbsView embeddedParams={embeddedParams} />
      <div className={`collection-background single-token`}>
        <ImageLazy
          className="picture-banner"
          alt="Collection Banner"
          src={
            ownerInfo && ownerInfo?.bannerImage
              ? `${changeIPFSLink(ownerInfo?.bannerImage)}`
              : 'https://storage.googleapis.com/rair_images/1683038949498-1548817833.jpeg'
          }
        />
      </div>
      <div>
        <TitleCollection
          title={selectedData?.name}
          someUsersData={someUsersData}
          userName={ownerInfo?.owner}
        />
        <div
          style={{
            position: 'relative'
          }}
          className="resale-single-token-view"></div>
        <div className="nft-data-content">
          <div
            className="nft-collection nft-collection-wrapper"
            style={{
              backgroundColor: `${
                primaryColor === '#dedede'
                  ? 'var(--rhyno-40)'
                  : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
              }`
            }}>
            {verticalImage && (
              <div
                onClick={() => {
                  document
                    .getElementById('image-lazy-single')
                    ?.requestFullscreen();
                }}
                className="nft-collection-icons expand">
                <div
                  className={`etherscan-icon-token-${
                    primaryColor === 'rhyno' ? 'light' : 'dark'
                  } expand`}>
                  <ExpandImageIcon primaryColor={primaryColor} />
                </div>
              </div>
            )}
            <EtherscanIconComponent
              blockchain={blockchain}
              contract={contract}
              currentTokenId={currentCollection?.[tokenId]?._id}
              selectedToken={selectedToken}
              classTitle={
                selectedData?.animation_url && isFileUrl !== 'gif'
                  ? 'nft-collection-video-etherscan'
                  : 'nft-collection-icons'
              }
            />
            <div
              className={
                selectedData?.animation_url && isFileUrl !== 'gif'
                  ? 'nft-videos-wrapper-container'
                  : `nft-images-gifs-wrapper ${verticalImage ? 'resize' : ''}`
              }>
              <EtherscanIconComponent
                blockchain={blockchain}
                contract={contract}
                selectedToken={selectedToken}
                currentTokenId={currentCollection?.[tokenId]?._id}
                classTitle={
                  selectedData?.animation_url && isFileUrl !== 'gif'
                    ? 'nft-collection-single-video'
                    : 'nft-collection-icons-media'
                }
              />
              {selectedData?.animation_url ? (
                isFileUrl === 'gif' ||
                isFileUrl === 'png' ||
                isFileUrl === 'jpeg' ||
                isFileUrl === 'webp' ? (
                  <div
                    className="single-token-block-img"
                    style={{
                      backgroundImage: `url(${
                        selectedData?.image
                          ? selectedData.image
                          : `${
                              import.meta.env.VITE_IPFS_GATEWAY
                            }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
                      })`
                    }}></div>
                ) : (
                  <div className="single-token-block-video">
                    <ReactPlayer
                      width={'100%'}
                      height={'100%'}
                      controls
                      playing={playing}
                      onReady={handlePlaying}
                      url={checkIPFSanimation(selectedData?.animation_url)}
                      light={
                        selectedData.image
                          ? selectedData?.image
                          : `${
                              import.meta.env.VITE_IPFS_GATEWAY
                            }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
                      }
                      loop={false}
                      playIcon={
                        <PlayCircle className="play-circle-nft-video" />
                      }
                      onEnded={handlePlaying}
                    />
                  </div>
                )
              ) : (
                <ImageLazy
                  id="image-lazy-single"
                  src={
                    selectedData?.image
                      ? ipfsLink
                      : `${
                          import.meta.env.VITE_IPFS_GATEWAY
                        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
                  }
                  alt="nft token image"
                  className="single-token-block-img"
                />
              )}
            </div>
          </div>
          <SerialNumberBuySell
            serialNumberData={serialNumberData}
            handleClickToken={handleClickToken}
            setSelectedToken={setSelectedToken}
            blockchain={blockchain}
            offerData={offerData}
            selectedToken={selectedToken}
            tokenDataForResale={currentCollection?.[tokenId]}
          />
          <div className="properties-title">
            <TitleSingleTokenView title="Description" isDarkMode={isDarkMode} />
          </div>
          <div
            className="description-text"
            style={{
              color: `${primaryColor === 'rhyno' ? '#383637' : '#A7A6A6'}`
            }}>
            {selectedData?.description !== 'none' &&
            selectedData?.description !== 'No description available' ? (
              selectedData?.description
            ) : (
              <>
                This {hotdropsVar ? 'collectible' : 'NFT'} doesn&apos;t have a
                description.
              </>
            )}
          </div>
          <div className="properties-title">
            <TitleSingleTokenView title="Properties" isDarkMode={isDarkMode} />
          </div>
          {selectedData?.attributes && selectedData?.attributes?.length > 0 ? (
            <SingleTokenViewProperties selectedData={selectedData} />
          ) : (
            <div className="description-text">
              {`This ${
                hotdropsVar ? 'collectible' : 'nft'
              } doesn't have any properties.`}
            </div>
          )}
        </div>
        <div className="this-nft-unlocks">
          <TitleSingleTokenView
            title={`This ${hotdropsVar ? 'collectible' : 'NFT'} unlocks`}
            isDarkMode={isDarkMode}
          />
        </div>
        {productsFromOffer && productsFromOffer.length > 0 ? (
          <>
            <div
              className="nft-collection nft-collection-video-wrapper"
              style={{
                backgroundColor: `${
                  primaryColor === '#dedede'
                    ? 'var(--rhyno-40)'
                    : `color-mix(in srgb, ${primaryColor} 40%, #888888)`
                }`
              }}>
              <UnlockableVideosSingleTokenPage
                selectVideo={selectVideo}
                setSelectVideo={setSelectVideo}
                productsFromOffer={productsFromOffer}
                openVideoplayer={openVideoplayer}
                setOpenVideoPlayer={setOpenVideoPlayer}
                handlePlayerClick={handlePlayerClick}
              />
            </div>
          </>
        ) : productsFromOffer === undefined ? (
          <LoadingComponent />
        ) : (
          <div className="description-text">{`This ${
            hotdropsVar ? 'collectible' : 'NFT'
          } doesn't have any unlockable videos.`}</div>
        )}
      </div>
    </main>
  );
};

export default NftDataPageMain;
