import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// import CustomShareButton from './CustomShareButton';
import EtherscanIconComponent from './EtherscanIconComponent';
import SerialNumberBuySell from './SerialNumberBuySell';
import SingleTokenViewProperties from './SingleTokenViewProperties';
import { TitleSingleTokenView } from './TitleSingleTokenView';
import UnlockableVideosSingleTokenPage from './UnlockableVideosSingleTokenPage';

import { TFileType, TNftItemResponse } from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import { setTokenData } from '../../../../ducks/nftData/action';
import { InitialNftDataStateType } from '../../../../ducks/nftData/nftData.types';
import useIPFSImageLink from '../../../../hooks/useIPFSImageLink';
// import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { ExpandImageIcon } from '../../../../images';
import { checkIPFSanimation } from '../../../../utils/checkIPFSanimation';
import setDocumentTitle from '../../../../utils/setTitle';
import LoadingComponent from '../../../common/LoadingComponent';
import { ReactComponent as PlayCircle } from '../../assets/PlayCircle.svg';
import { ImageLazy } from '../../ImageLazy/ImageLazy';
import { INftDataPageMain, TOffersIndexesData } from '../../mockupPage.types';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import { changeIPFSLink } from '../utils/changeIPFSLink';

import TitleCollection from './TitleCollection/TitleCollection';

const NftDataPageMain: React.FC<INftDataPageMain> = ({
  blockchain,
  contract,
  currentUser,
  handleClickToken,
  product,
  primaryColor,
  productsFromOffer,
  selectedData,
  selectedToken,
  setSelectedToken,
  totalCount,
  textColor,
  offerData,
  offerDataInfo,
  someUsersData,
  ownerInfo,
  embeddedParams,
  handleTokenBoughtButton,
  setTokenNumber
}) => {
  const { tokenData, tokenDataListTotal } = useSelector<
    RootState,
    InitialNftDataStateType
  >((state) => state.nftDataStore);
  const [serialNumberData, setSerialNumberData] = useState({});
  // const { width } = useWindowDimensions();
  const [selectVideo, setSelectVideo] = useState<TFileType | undefined>();
  const [openVideoplayer, setOpenVideoPlayer] = useState<boolean>(false);
  const [verticalImage, setVerticalImage] = useState(false);
  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();
  const navigate = useNavigate();
  const myRef = useRef(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [, /*offersIndexesData*/ setOffersIndexesData] =
    useState<TOffersIndexesData[]>();
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };
  const [tokenFullData, setTokenFullData] = useState<any>(undefined);
  const dispatch = useDispatch();

  const getAllProduct = useCallback(
    async () => {
      if (tokenDataListTotal) {
        const responseAllProduct = await axios.get<TNftItemResponse>(
          `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=0&toToken=${tokenDataListTotal}`
        );

        const tokenMapping = {};

        if (responseAllProduct.data.success && responseAllProduct.data.result) {
          responseAllProduct.data.result.tokens.forEach((item) => {
            tokenMapping[item.token] = item;
          });
        }

        setSerialNumberData(tokenMapping);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product, contract, blockchain, dispatch, tokenDataListTotal]
  );

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

  // useEffect(() => {
  //   getAllProduct();
  // }, [getAllProduct]);

  const handlePlayerClick = () => {
    setOpenVideoPlayer(true);
  };

  const fetchTokenFullData = useCallback(async () => {
    const { data } = await axios.get<TNftItemResponse>(
      `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=0&toToken=1`
    );

    if (data.success) {
      const response = await axios.get<TNftItemResponse>(
        `/api/nft/network/${blockchain}/${contract}/${product}?fromToken=0&toToken=${data.result.totalCount}`
      );
      setTokenFullData(response.data.result.tokens);
    }
  }, [blockchain, contract, product, setTokenFullData]);

  useEffect(() => {
    fetchTokenFullData();
  }, [fetchTokenFullData]);

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
    dispatch(setShowSidebarTrue());
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
                <i style={{ color: 'red' }} className="fas fa-key" />
              ) : e.offerIndex === '1' ? (
                '🔑'
              ) : (
                <i style={{ color: 'silver' }} className="fas fa-key" />
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
    if (selectedToken) {
      setTokenNumber(Number(selectedToken));
    }
  }, [selectedToken]);

  if (!selectedData?.name) {
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
          selectedData={selectedData}
          title={selectedData?.name}
          someUsersData={someUsersData}
          userName={ownerInfo?.owner}
        />
        <div className="nft-data-content">
          <div
            className="nft-collection nft-collection-wrapper"
            style={{
              backgroundColor: `${
                primaryColor === 'rhyno' ? 'var(--rhyno-40)' : '#383637'
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
              currentTokenId={
                tokenData && selectedToken && tokenData[selectedToken]?._id
              }
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
                currentTokenId={
                  tokenData && selectedToken && tokenData[selectedToken]?._id
                }
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
                          : 'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
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
                          : 'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
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
                      : 'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
                  }
                  alt="nft token image"
                  className="single-token-block-img"
                />
              )}
            </div>
          </div>
          {tokenFullData && (
            <SerialNumberBuySell
              primaryColor={primaryColor}
              tokenData={tokenFullData}
              handleClickToken={handleClickToken}
              setSelectedToken={setSelectedToken}
              totalCount={totalCount}
              blockchain={blockchain as BlockchainType}
              offerData={offerData}
              product={product}
              contract={contract}
              selectedToken={selectedToken}
              textColor={textColor}
              currentUser={currentUser}
              handleTokenBoughtButton={handleTokenBoughtButton}
            />
          )}
          <div className="properties-title">
            <TitleSingleTokenView
              title="Description"
              primaryColor={primaryColor}
            />
          </div>
          <div
            className="description-text"
            style={{
              color: `${primaryColor === 'rhyno' ? '#383637' : '#A7A6A6'}`
            }}>
            {selectedData?.description !== 'none' &&
            selectedData?.description !== 'No description available'
              ? selectedData?.description
              : "This NFT doesn't have any description"}
          </div>
          <div className="properties-title">
            <TitleSingleTokenView
              title="Properties"
              primaryColor={primaryColor}
            />
          </div>
          {selectedData?.attributes && selectedData?.attributes?.length > 0 ? (
            <SingleTokenViewProperties
              selectedData={selectedData}
              textColor={textColor}
            />
          ) : (
            <div className="description-text">
              This nft doesn&apos;t have any properties
            </div>
          )}
        </div>
        <div className="this-nft-unlocks">
          <TitleSingleTokenView
            title="This NFT unlocks"
            primaryColor={primaryColor}
          />
        </div>
        {productsFromOffer && productsFromOffer.length > 0 ? (
          <>
            <div
              className="nft-collection nft-collection-video-wrapper"
              style={{
                backgroundColor: `${
                  primaryColor === 'rhyno' ? 'var(--rhyno-40)' : '#383637'
                }`
              }}>
              <UnlockableVideosSingleTokenPage
                selectVideo={selectVideo}
                setSelectVideo={setSelectVideo}
                productsFromOffer={productsFromOffer}
                openVideoplayer={openVideoplayer}
                setOpenVideoPlayer={setOpenVideoPlayer}
                handlePlayerClick={handlePlayerClick}
                primaryColor={primaryColor}
              />
            </div>
          </>
        ) : productsFromOffer === undefined ? (
          <LoadingComponent />
        ) : (
          <div className="description-text">{`This nft doesn't have any unlockable videos`}</div>
        )}
      </div>
    </main>
  );
};

export default NftDataPageMain;
