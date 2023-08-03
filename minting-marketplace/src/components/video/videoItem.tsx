import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Provider, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import axios, { AxiosError } from 'axios';
import { Contract } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useStateIfMounted } from 'use-state-if-mounted';

import { IVideoItem, TVideoItemContractData } from './video.types';
import OfferBuyButton from './videoOfferBuy';

import {
  IOffersResponseType,
  TTokenData,
  TUserResponse
} from '../../axios.responseTypes';
import store, { RootState } from '../../ducks';
import { ColorChoice } from '../../ducks/colors/colorStore.types';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { UserType } from '../../ducks/users/users.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import chainData from '../../utils/blockchainData';
import formatDuration from '../../utils/durationUtils';
import { rFetch } from '../../utils/rFetch';
import { TooltipBox } from '../common/Tooltip/TooltipBox';
import { TOfferType } from '../marketplace/marketplace.types';
import { ImageLazy } from '../MockUpPage/ImageLazy/ImageLazy';
import NftVideoplayer from '../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import MintPopUpCollection from '../MockUpPage/NftList/NftData/TitleCollection/MintPopUpCollection/MintPopUpCollection';
// import { SvgKey } from '../MockUpPage/NftList/SvgKey';
import { SvgLock } from '../MockUpPage/NftList/SvgLock';
import CustomButton from '../MockUpPage/utils/button/CustomButton';
import { ModalContentCloseBtn } from '../MockUpPage/utils/button/ShowMoreItems';
import { playImagesColored } from '../SplashPage/images/greyMan/grayMan';
import defaultAvatar from '../UserProfileSettings/images/defaultUserPictures.png';

Modal.setAppElement('#root');

const VideoItem: React.FC<IVideoItem> = ({
  mediaList,
  item
  // handleVideoIsUnlocked
}) => {
  const [mintPopUp, setMintPopUp] = useState<boolean>(false);
  const [firstStepPopUp, setFirstStepPopUp] = useState<boolean>(false);
  const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);
  const loading = useSelector<RootState, boolean>(
    (state) => state.videosStore.loading
  );
  const navigate = useNavigate();
  const [offerDataInfo, setOfferDataInfo] = useState<TOfferType[]>();
  const { minterInstance, diamondMarketplaceInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);
  const [contractData, setContractData] =
    useStateIfMounted<TVideoItemContractData | null>(null);
  const { width } = useWindowDimensions();

  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const hotDropsVar = process.env.REACT_APP_HOTDROPS;

  const customStyles = {
    overlay: {
      zIndex: '52'
    },
    content: {
      background: primaryColor === 'rhyno' ? '#F2F2F2' : '#383637',
      top: width > 500 ? '50%' : '55%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      fontFamily: 'Plus Jakarta Text',
      border: 'none',
      borderRadius: '16px',
      padding: width < 500 ? '15px' : '20px',
      overflow: width < 500 ? '' : 'auto'
    }
  };

  const availableToken: TTokenData[] = [];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [owned /*setOwned*/] = useState(false);
  const [openVideoplayer, setOpenVideoplayer] = useState(false);
  const [dataUser, setDataUser] = useStateIfMounted<UserType | null>(null);
  const reactSwal = useSwal();

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, [setModalIsOpen]);

  const openHelp = useCallback(() => {
    setModalHelp((prev) => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setOpenVideoplayer(false);
  }, [setModalIsOpen]);

  const openMintPopUp = () => {
    reactSwal.fire({
      title: (
        <div>
          <div
            style={{
              width: '120px',
              height: '35px',
              background: 'var(--stimorol)',
              fontSize: '16px',
              color: '#fff',
              position: 'absolute',
              top: '0px',
              left: '0px',
              borderTopLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${` ${
                primaryColor === 'rhyno' ? '#2d2d2d' : '#fff'
              }`}`
            }}>
            Mint
          </div>
        </div>
      ),
      html: (
        <Provider store={store}>
          <div
            className={`container-popup-video-player-mobile ${
              primaryColor === 'rhyno' ? 'rhyno' : ''
            }`}>
            {offerDataInfo && contractData && (
              <MintPopUpCollection
                blockchain={contractData?.blockchain}
                offerDataCol={offerDataInfo}
                primaryColor={primaryColor}
                contractAddress={contractData?.contractAddress}
                setPurchaseStatus={setPurchaseStatus}
              />
            )}
          </div>
        </Provider>
      ),
      showCloseButton: true,
      showConfirmButton: false,
      width: '85vw',
      customClass: {
        popup: `bg-${primaryColor} rounded-rair`
      }
    });
  };

  const openUpragePopUp = () => {
    return (
      <div>
        <div
          className={`container-popup-video-player-mobile ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
          <div>
            <p>
              NFTs unlock exclusive content for this collection. Purchase pass
              here or view collection to choose a unique item.
            </p>
            {mediaList[item].description && (
              <p>{mediaList[item].description}</p>
            )}
          </div>
          <div className="popup-video-player-mint-box">
            <CustomButton
              onClick={() => {
                openMintPopUp();
              }}
              width="161px"
              height="48px"
              // margin="20px 0 0 0"
              text="Mint!"
              background={'var(--stimorol)'}
              hoverBackground={`rgb(74, 74, 74)`}
            />
          </div>
        </div>
        <Popup
          // className="popup-settings-block"
          open={mintPopUp}
          // position="right center"
          closeOnDocumentClick
          onClose={() => {
            setMintPopUp(false);
          }}>
          <div
            style={{
              background: 'red',
              width: '50px',
              height: '50px'
            }}>
            Hello there
          </div>
          {offerDataInfo && contractData && (
            <div>
              <button onClick={() => setMintPopUp(false)}>Close</button>
              <MintPopUpCollection
                blockchain={contractData?.blockchain}
                offerDataCol={offerDataInfo}
                primaryColor={primaryColor}
                contractAddress={contractData?.contractAddress}
                setPurchaseStatus={setPurchaseStatus}
              />
            </div>
          )}
        </Popup>
      </div>
    );
  };

  const goToCollectionView = () => {
    if (offerDataInfo && offerDataInfo.length > 0) {
      navigate(
        `/collection/${contractData?.blockchain}/${contractData?.contractAddress}/${offerDataInfo[0].product}/0`
      );
    }
  };

  // const goToUnlockView = () => {
  //   navigate(
  //     `/unlockables/${contractData?.blockchain}/${contractData?.contractAddress}/${mediaList[item]?.product}/0`
  //   );
  // };

  const getInfo = useCallback(async () => {
    if (mediaList && item) {
      const { data } = await rFetch(
        `/api/v2/files/${mediaList[item]._id}/unlocks`
      );

      if (data && data.offers) {
        const resultOffers = data.offers;
        const { contract } = await rFetch(
          `/api/v2/contracts/${data.offers[0].contract._id}`
        );

        try {
          const tokensrResp = await axios.get(
            `/api/nft/network/${contract?.blockchain}/${contract?.contractAddress}/${resultOffers[0].product}`
            // `/api/${mediaList[item].contract}/${mediaList[item]?.product}`
          );

          const { data } = await axios.get<IOffersResponseType>(
            `/api/nft/network/${contract?.blockchain}/${contract?.contractAddress}/${resultOffers[0].product}/offers`
          );

          if (data.success) {
            setOfferDataInfo(data.product.offers);
          }

          contract.tokens = tokensrResp.data.result.tokens;
          // contract.products = productsResp.data.product;
        } catch (err) {
          console.error(err);
        }

        setContractData(contract);
      }
    }
  }, [mediaList, item, setContractData]);

  const getInfoUser = useCallback(async () => {
    if (mediaList && item && mediaList[item].uploader) {
      const response = await axios.get<TUserResponse>(
        `/api/users/${mediaList[item].uploader}`
        // `/api/users/${data.data.result.contract.user}`
      );
      setDataUser(response.data.user);
    }
  }, [mediaList, item, setDataUser]);

  useEffect(() => {
    getInfoUser();
  }, [getInfoUser]);

  useEffect(() => {
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    getInfo();
  }, [getInfo]);

  return (
    <button
      className="text-start video-wrapper unlockable-video"
      style={{
        border: 'none',
        backgroundColor: 'transparent'
      }}
      onMouseEnter={() => setHovering(mediaList[item].animatedThumbnail !== '')}
      onMouseLeave={() => setHovering(false)}>
      <div
        onClick={() => openModal()}
        className="col-12 rounded"
        style={{
          top: 0,
          position: 'relative',
          height: '100%',
          width: 'inherit'
        }}>
        <img
          alt="Video thumbnail"
          src={`${mediaList[item].staticThumbnail}`}
          style={{
            position: 'absolute',
            bottom: 0,
            borderRadius: '16px',
            background: 'black'
          }}
          className="col-12 h-100 w-100"
        />
        <img
          alt="Animated video thumbnail"
          src={`${mediaList[item].animatedThumbnail}`}
          style={{
            position: 'absolute',
            display: hovering ? 'block' : 'none',
            bottom: 0,
            borderRadius: '16px',
            background: 'black'
          }}
          className="col-12  h-100 w-100"
        />
        {mediaList[item]?.isUnlocked ? null : <SvgLock color={'white'} />}
      </div>
      <div className="col description-wrapper-video">
        <span className="description-title">
          {mediaList[item].title.slice(0, 25)}
          {mediaList[item].title.length > 26 ? '...' : ''}
        </span>
        <div className="info-wrapper video-size">
          <div className="user-info">
            <img
              src={dataUser?.avatar ? dataUser.avatar : defaultAvatar}
              alt="User Avatar"
              style={{ marginRight: '10px' }}
            />
            <div className="user-name">
              <span>
                {dataUser?.nickName?.slice(0, 25)}
                {dataUser?.nickName && dataUser?.nickName.length > 26
                  ? '...'
                  : ''}
              </span>
            </div>
          </div>
          <div className="price-info">
            <div className="price-total">
              <span className="duration-for-video">
                {' '}
                {formatDuration(mediaList[item].duration)}
              </span>
            </div>
          </div>
        </div>
        <br />
        <>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Video Modal">
            <div className="modal-content-close-btn-wrapper">
              {width < 500 && (
                <div
                  className={`popup-video-player-mobile-title ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}>
                  <div className="user-info">
                    <img
                      src={dataUser?.avatar ? dataUser.avatar : defaultAvatar}
                      alt="User Avatar"
                      style={{ marginRight: '10px' }}
                    />
                    <div className="user-name">
                      <span>
                        {dataUser?.nickName && dataUser?.nickName.length > 14
                          ? `${dataUser?.nickName?.slice(
                              0,
                              14
                            )}...${dataUser?.nickName?.slice(length - 5)}`
                          : dataUser?.nickName}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <ModalContentCloseBtn
                primaryColor={primaryColor}
                onClick={closeModal}>
                <i className="fas fa-times" style={{ lineHeight: 'inherit' }} />
              </ModalContentCloseBtn>
            </div>
            {width < 500 && (
              <div
                className="mobile-view-buttons-video"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                <CustomButton
                  text={'View Collection'}
                  width={'160px'}
                  height={'30px'}
                  textColor={primaryColor === 'rhyno' ? '#222021' : 'white'}
                  onClick={goToCollectionView}
                  margin={'0px 0px 0.35rem 0.5rem'}
                  custom={false}
                  background={`var(--${
                    primaryColor === 'charcoal' ? 'charcoal-80' : 'charcoal-40'
                  })`}
                />
                {mediaList[item]?.isUnlocked === false && (
                  <CustomButton
                    text={'Upgrade'}
                    width={'160px'}
                    height={'30px'}
                    textColor={primaryColor === 'rhyno' ? '#222021' : 'white'}
                    onClick={() => setFirstStepPopUp(true)}
                    margin={'0px 0px 0.35rem 0.5rem'}
                    custom={false}
                    background={`var(--${
                      primaryColor === 'charcoal'
                        ? 'charcoal-80'
                        : 'charcoal-40'
                    })`}
                  />
                )}
                <Popup
                  // className="popup-settings-block"
                  open={firstStepPopUp}
                  // position="right center"
                  onClose={() => {
                    setFirstStepPopUp(false);
                  }}>
                  <div
                    style={{
                      width: '85vw',
                      background: 'rgb(56, 54, 55)',
                      borderRadius: '12px',
                      padding: '70px 15px 15px 15px',
                      position: 'relative'
                    }}>
                    <div
                      style={{
                        display: 'flex'
                      }}>
                      <div
                        style={{
                          width: '120px',
                          height: '35px',
                          background: 'var(--stimorol)',
                          fontSize: '16px',
                          color: '#fff',
                          position: 'absolute',
                          top: '0px',
                          left: '0px',
                          borderTopLeftRadius: '16px',
                          borderBottomRightRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${` ${
                            primaryColor === 'rhyno' ? '#2d2d2d' : '#fff'
                          }`}`
                        }}>
                        Upgrade
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          right: '5px',
                          top: '5px'
                        }}>
                        <ModalContentCloseBtn
                          primaryColor={primaryColor}
                          onClick={() => {
                            setFirstStepPopUp(false);
                          }}>
                          <i
                            className="fas fa-times"
                            style={{ lineHeight: 'inherit' }}
                          />
                        </ModalContentCloseBtn>
                      </div>
                    </div>
                    <div
                      className={`container-popup-video-player-mobile ${
                        primaryColor === 'rhyno' ? 'rhyno' : ''
                      }`}>
                      <div>
                        <p>
                          NFTs unlock exclusive content for this collection.
                          Purchase pass here or view collection to choose a
                          unique item.
                        </p>
                        {mediaList[item].description && (
                          <p>{mediaList[item].description}</p>
                        )}
                      </div>
                      <div className="popup-video-player-mint-box">
                        <CustomButton
                          onClick={() => {
                            setMintPopUp(true);
                          }}
                          width="161px"
                          height="48px"
                          // margin="20px 0 0 0"
                          text="Mint!"
                          background={'var(--stimorol)'}
                          hoverBackground={`rgb(74, 74, 74)`}
                        />
                      </div>
                    </div>
                  </div>
                </Popup>
                <Popup
                  // className="popup-settings-block"
                  open={mintPopUp}
                  // position="right center"
                  onClose={() => {
                    setMintPopUp(false);
                  }}>
                  {offerDataInfo && contractData && (
                    <MintPopUpCollection
                      closeModal={() => {
                        setMintPopUp(false);
                      }}
                      blockchain={contractData?.blockchain}
                      offerDataCol={offerDataInfo}
                      primaryColor={primaryColor}
                      contractAddress={contractData?.contractAddress}
                      setPurchaseStatus={setPurchaseStatus}
                    />
                  )}
                </Popup>
              </div>
            )}
            <div
              className={`text-white modal-content-wrapper-for-video modal-content-wrapper-for-video-${
                mediaList[item]?.isUnlocked && !owned ? 'unlocked' : 'locked'
              }`}>
              <div className="modal-content-video">
                {mediaList[item]?.isUnlocked === false && !owned ? (
                  <>
                    <TooltipBox
                      enterDelay={200}
                      title="You Need to Buy This NFT!">
                      <i
                        data-title="You Need to Buy This NFT!"
                        className="fa fa-lock modal-content-video-lock"
                      />
                    </TooltipBox>
                  </>
                ) : openVideoplayer ? (
                  <NftVideoplayer selectVideo={mediaList[item]} />
                ) : (
                  <>
                    <div className="modal-content-play-image-container">
                      <div>
                        <img
                          onClick={() => setOpenVideoplayer(true)}
                          className={'modal-content-play-image'}
                          src={playImagesColored}
                          alt="Button play video"
                        />
                      </div>
                    </div>
                  </>
                )}

                {openVideoplayer ? null : mediaList[item]?.isUnlocked ===
                    false && !owned ? (
                  <img
                    alt="Modal content video thumbnail"
                    src={`${mediaList[item].staticThumbnail}`}
                    className="modal-content-video-thumbnail video-locked-modal"
                  />
                ) : (
                  <img
                    alt="Modal content video thumbnail"
                    src={`${mediaList[item].staticThumbnail}`}
                    className="modal-content-video-thumbnail"
                  />
                )}
              </div>
              {width > 500 && (
                <div className="modal-content-video-choice">
                  <div className="modal-content-block-btns">
                    <div className="modal-content-block-buy">
                      {hotDropsVar === 'true' ? (
                        <img
                          src={contractData?.tokens?.at(0)?.metadata?.image}
                          alt="NFT token powered by Hotdrops"
                        />
                      ) : (
                        <img
                          src={contractData?.tokens?.at(0)?.metadata?.image}
                          alt="NFT token powered by Rair tech"
                        />
                      )}
                      {mediaList[item]?.isUnlocked === false && (
                        <CustomButton
                          text={'Upgrade'}
                          width={'208px'}
                          height={'48px'}
                          textColor={
                            primaryColor === 'rhyno' ? '#222021' : 'white'
                          }
                          onClick={openHelp}
                          margin={'0px 0px 0.35rem 0.5rem'}
                          custom={true}
                          loading={loading}
                          background={
                            'linear-gradient(96.34deg,#725bdb,#805fda 10.31%,#8c63da 20.63%,#9867d9 30.94%,#a46bd9 41.25%,#af6fd8 51.56%,#af6fd8 0,#bb73d7 61.25%,#c776d7 70.94%,#d27ad6 80.62%,#dd7ed6 90.31%,#e882d5)'
                          }
                        />
                      )}
                    </div>
                    <CustomButton
                      text={'View Collection'}
                      width={'208px'}
                      height={'48px'}
                      textColor={primaryColor === 'rhyno' ? '#222021' : 'white'}
                      onClick={goToCollectionView}
                      margin={'0px 0px 0.35rem 0.5rem'}
                      custom={false}
                      background={`var(--${
                        primaryColor === 'charcoal'
                          ? 'charcoal-80'
                          : 'charcoal-40'
                      })`}
                    />
                  </div>
                </div>
              )}
            </div>
            <span className="text-white mt-5">Unlocked by NFTs from:</span>
            {mediaList[item]?.unlockData?.offers?.map((offer, index) => (
              <OfferBuyButton key={index} {...offer} />
            ))}
            {modalHelp && mediaList[item]?.isUnlocked === false && (
              <div className="more-info-wrapper">
                <span className="more-info-text">
                  These NFTs unlock this video:
                </span>
                <div className="more-info">
                  {availableToken.length > 0 ? (
                    availableToken.map((token) => {
                      return (
                        <div
                          key={token._id}
                          className="more-info-unlock-wrapper">
                          <ImageLazy
                            src={token.metadata.image}
                            alt="NFT token powered by Rair Tech"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <span className="more-info-text">
                      In this collection we don&apos;t have any tokens available
                      for sale, sorry.
                    </span>
                  )}
                </div>
              </div>
            )}
          </Modal>
        </>
      </div>
    </button>
  );
};

export default VideoItem;
