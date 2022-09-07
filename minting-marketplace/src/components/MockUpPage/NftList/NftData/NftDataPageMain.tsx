import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import setDocumentTitle from '../../../../utils/setTitle';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import TitleCollection from './TitleCollection/TitleCollection';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import { INftDataPageMain, TOffersIndexesData } from '../../mockupPage.types';
import CustomShareButton from './CustomShareButton';
import { TFileType } from '../../../../axios.responseTypes';
import EtherscanIconComponent from './EtherscanIconComponent';
import { ReactComponent as PlayCircle } from '../../assets/PlayCircle.svg';
import SerialNumberBuySell from './SerialNumberBuySell';
import { TitleSingleTokenView } from './TitleSingleTokenView';
import SingleTokenViewProperties from './SingleTokenViewProperties';
import UnlockableVideosSingleTokenPage from './UnlockableVideosSingleTokenPage';
import { CircularProgress } from '@mui/material';
import { RootState } from '../../../../ducks';
import { InitialNftDataStateType } from '../../../../ducks/nftData/nftData.types';

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
  loginDone,
  embeddedParams
}) => {
  const { tokenData } = useSelector<RootState, InitialNftDataStateType>(
    (state) => state.nftDataStore
  );
  const [selectVideo, setSelectVideo] = useState<TFileType | undefined>();
  const [openVideoplayer, setOpenVideoPlayer] = useState<boolean>(false);
  const [isFileUrl, setIsFileUrl] = useState<string | undefined>();
  const navigate = useNavigate();
  const myRef = useRef(null);
  const [playing, setPlaying] = useState<boolean>(false);
  const [, /*offersIndexesData*/ setOffersIndexesData] =
    useState<TOffersIndexesData[]>();
  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectVideo(productsFromOffer[0]);
  }, [setSelectVideo, productsFromOffer]);

  const checkUrl = useCallback(() => {
    if (selectedData && selectedData.animation_url) {
      const fileUrl = selectedData?.animation_url;
      const parts = fileUrl.split('/').pop()?.split('.');
      const ext = parts && parts.length > 1 ? parts?.pop() : '';
      setIsFileUrl(ext);
    }
  }, [selectedData, setIsFileUrl]);

  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  const goToUnlockables = () => {
    embeddedParams
      ? embeddedParams.setMode('unlockables')
      : navigate(
          `/unlockables/${blockchain}/${contract}/${product}/${selectedToken}`
        );
  };

  const handlePlayerClick = () => {
    setOpenVideoPlayer(true);
  };

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

  if (!selectedData?.name) {
    return (
      <div className="list-wrapper-empty">
        <CircularProgress
          sx={{ color: '#E882D5' }}
          size={100}
          thickness={4.6}
        />
      </div>
    );
  }

  return (
    <main ref={myRef} id="nft-data-page-wrapper">
      <BreadcrumbsView embeddedParams={embeddedParams} />
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
            <EtherscanIconComponent
              blockchain={blockchain}
              contract={contract}
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
                  : 'nft-images-gifs-wrapper'
              }>
              <EtherscanIconComponent
                blockchain={blockchain}
                contract={contract}
                selectedToken={selectedToken}
                classTitle={
                  selectedData?.animation_url && isFileUrl !== 'gif'
                    ? 'nft-collection-single-video'
                    : 'nft-collection-icons-media'
                }
              />
              {selectedData?.animation_url ? (
                isFileUrl === 'gif' ? (
                  <div
                    className="single-token-block-img"
                    style={{
                      backgroundImage: `url(${
                        selectedData?.animation_url
                          ? selectedData.animation_url
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
                      url={selectedData?.animation_url}
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
                <img
                  src={
                    selectedData?.image
                      ? selectedData.image
                      : 'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
                  }
                  alt="nft token image"
                  className="single-token-block-img"
                  // style={{ objectFit: 'fill' }}
                  // style={{
                  //   backgroundImage: `url(${
                  //     selectedData?.image
                  //       ? selectedData.image
                  //       : 'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW'
                  //   })`
                  // }}
                ></img>
              )}
            </div>
          </div>
          {tokenData && (
            <SerialNumberBuySell
              primaryColor={primaryColor}
              tokenData={tokenData}
              handleClickToken={handleClickToken}
              setSelectedToken={setSelectedToken}
              totalCount={totalCount}
              blockchain={blockchain}
              offerData={offerData}
              product={product}
              contract={contract}
              selectedToken={selectedToken}
              textColor={textColor}
              currentUser={currentUser}
              loginDone={loginDone}
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
        {productsFromOffer && productsFromOffer.length !== 0 ? (
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
            <div className="more-unlockables-button-container">
              <div className="share-button-linear-border more-unlock">
                <CustomShareButton
                  title="More Unlockables"
                  handleClick={goToUnlockables}
                  primaryColor={primaryColor}
                  isCollectionPathExist={false}
                  moreUnlockablesClassName={'share-button-more-unlock'}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="description-text">{`This nft doesn't have any unlockable videos`}</div>
        )}
      </div>
    </main>
  );
};

export default NftDataPageMain;
