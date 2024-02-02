import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Provider, useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { constants, utils } from 'ethers';
import { OreidProvider, useOreId } from 'oreid-react';
import { useStateIfMounted } from 'use-state-if-mounted';

import { IVideoItem, TVideoItemContractData } from './video.types';

import { TUserResponse } from '../../axios.responseTypes';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { TUsersInitialState, UserType } from '../../ducks/users/users.types';
import useSwal from '../../hooks/useSwal';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { YotiLogo } from '../../images';
import formatDuration from '../../utils/durationUtils';
import { rFetch } from '../../utils/rFetch';
import { TooltipBox } from '../common/Tooltip/TooltipBox';
import { TOfferType } from '../marketplace/marketplace.types';
import NftVideoplayer from '../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import { SvgLock } from '../MockUpPage/NftList/SvgLock';
import CustomButton from '../MockUpPage/utils/button/CustomButton';
import { ModalContentCloseBtn } from '../MockUpPage/utils/button/ShowMoreItems';
import { playImagesColored } from '../SplashPage/images/greyMan/grayMan';
import defaultAvatar from '../UserProfileSettings/images/defaultUserPictures.png';
import YotiPage from '../YotiPage/YotiPage';

Modal.setAppElement('#root');

const VideoItem: React.FC<IVideoItem> = ({
  mediaList,
  item
  // handleVideoIsUnlocked
}) => {
  // const [mintPopUp, setMintPopUp] = useState<boolean>(false);
  // const [firstStepPopUp, setFirstStepPopUp] = useState<boolean>(false);
  // const [purchaseStatus, setPurchaseStatus] = useState<boolean>(false);
  const [offersArray, setOffersArray] = useState<TOfferType[]>([]);

  const { userData } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const navigate = useNavigate();
  // const [offerDataInfo,setOfferDataInfo] = useState<TOfferType[]>();
  // const oreId = useOreId();
  const [contractData, setContractData] =
    useStateIfMounted<TVideoItemContractData | null>(null);
  const { width } = useWindowDimensions();

  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const customStyles = {
    overlay: {
      position: 'fixed',
      display: 'flex',
      justifyContent: 'center',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '1000',
      overflowY: 'auto'
    },
    content: {
      background: primaryColor === 'rhyno' ? '#F2F2F2' : '#383637',
      top: width > 500 ? '50%' : '55%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      marginTop: '3%',
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
      overflow: width < 500 ? '' : 'auto',
      position: 'absolute',
      zIndex: '1000'
    }
  };

  // const availableToken: TTokenData[] = [];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [owned /*setOwned*/] = useState(false);
  const [openVideoplayer, setOpenVideoplayer] = useState(false);
  const [dataUser, setDataUser] = useStateIfMounted<UserType | null>(null);
  const reactSwal = useSwal();

  const store = useStore();

  const openModal = useCallback(() => {
    setModalIsOpen(true);
  }, [setModalIsOpen]);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setOpenVideoplayer(false);
  }, [setModalIsOpen]);

  const ageVerificationPopUp = useCallback(() => {
    if (
      modalIsOpen &&
      mediaList[item].ageRestricted === true &&
      userData?.ageVerified === false
    ) {
      reactSwal.fire({
        html: (
          <Provider store={store}>
            <YotiPage setOpenVideoplayer={setOpenVideoplayer} />
          </Provider>
        ),
        showConfirmButton: false,
        width: '750px',
        customClass: {
          popup: `yoti-bg-color`
        }
      });
    } else {
      setOpenVideoplayer(true);
    }
  }, [modalIsOpen, mediaList, item, userData?.ageVerified, reactSwal, store]);

  // const openMintPopUp = () => {
  //   reactSwal.fire({
  //     title: (
  //       <div>
  //         <div
  //           style={{
  //             width: '120px',
  //             height: '35px',
  //             background: 'var(--stimorol)',
  //             fontSize: '16px',
  //             color: '#fff',
  //             position: 'absolute',
  //             top: '0px',
  //             left: '0px',
  //             borderTopLeftRadius: '16px',
  //             borderBottomRightRadius: '16px',
  //             display: 'flex',
  //             alignItems: 'center',
  //             justifyContent: 'center',
  //             border: `1px solid ${` ${
  //               primaryColor === 'rhyno' ? '#2d2d2d' : '#fff'
  //             }`}`
  //           }}>
  //           Mint
  //         </div>
  //       </div>
  //     ),
  //     html: (
  //       <OreidProvider oreId={oreId}>
  //         <Provider store={store}>
  //           <div
  //             className={`container-popup-video-player-mobile ${
  //               primaryColor === 'rhyno' ? 'rhyno' : ''
  //             }`}>
  //             {offerDataInfo && contractData && (
  //               <MintPopUpCollection
  //                 blockchain={contractData?.blockchain}
  //                 offerDataCol={offerDataInfo}
  //                 primaryColor={primaryColor}
  //                 contractAddress={contractData?.contractAddress}
  //                 setPurchaseStatus={setPurchaseStatus}
  //               />
  //             )}
  //           </div>
  //         </Provider>
  //       </OreidProvider>
  //     ),
  //     showCloseButton: true,
  //     showConfirmButton: false,
  //     width: '85vw',
  //     customClass: {
  //       popup: `bg-${primaryColor} rounded-rair`
  //     }
  //   });
  // };

  const goToCollectionView = () => {
    if (offersArray.length > 0) {
      const productValue = offersArray[0].product;
      navigate(
        `/collection/${contractData?.blockchain}/${contractData?.contractAddress}/${productValue}/0`
      );
    }
  };

  const getInfo = useCallback(async () => {
    if (mediaList && item) {
      const { data } = await rFetch(
        `/api/v2/files/${mediaList[item]._id}/unlocks`
      );

      if (data?.offers && data.offers.length > 0) {
        const firstOffer = data.offers[0];

        if (firstOffer.contract?._id) {
          const { contract } = await rFetch(
            `/api/v2/contracts/${firstOffer.contract._id}`
          );
          setOffersArray(data.offers);

          setContractData(contract);
        }
      }
    }
  }, [mediaList, item, setContractData]);

  const getInfoUser = useCallback(async () => {
    if (
      mediaList &&
      item &&
      mediaList[item].uploader &&
      utils.isAddress(mediaList[item].uploader) &&
      mediaList[item].uploader !== constants.AddressZero
    ) {
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

  // useEffect(() => {
  //   if (
  //     modalIsOpen &&
  //     mediaList[item].ageRestricted === true &&
  //     userData?.ageVerified === false
  //   ) {
  //     ageVerificationPopUp();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [modalIsOpen, mediaList, userData]);

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
              <ModalContentCloseBtn
                primaryColor={primaryColor}
                onClick={closeModal}>
                <i className="fas fa-times" style={{ lineHeight: 'inherit' }} />
              </ModalContentCloseBtn>
            </div>
            <div
              className={`${
                primaryColor !== 'rhyno' && 'text-white'
              } modal-content-wrapper-for-video ${
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
                          onClick={() => ageVerificationPopUp()}
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
              <div className="title-name-internal-options-wrapper">
                <div
                  className={`title-and-username-wrapper-for-video-modal popup-video-player-mobile-title ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}>
                  <div className="title-of-video">
                    {mediaList[item] && <h3>{mediaList[item].title}</h3>}
                  </div>
                  <div className="user-info">
                    <img
                      src={dataUser?.avatar ? dataUser.avatar : defaultAvatar}
                      alt="User Avatar"
                      style={{ marginRight: '10px' }}
                    />
                    <div className="user-name">
                      <span>
                        {dataUser?.nickName && dataUser?.nickName.length > 9
                          ? `${dataUser?.nickName?.slice(
                              0,
                              9
                            )}...${dataUser?.nickName?.slice(length - 5)}`
                          : dataUser?.nickName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="favorite-collection-upgrade-wrapper-for-video-modal">
                  {offersArray.length > 0 && (
                    <CustomButton
                      text={'View Collection'}
                      width={'160px'}
                      height={'30px'}
                      margin={'5px'}
                      textColor={primaryColor === 'rhyno' ? '#222021' : 'white'}
                      onClick={goToCollectionView}
                      custom={false}
                      background={`var(--${
                        primaryColor === 'charcoal'
                          ? 'charcoal-80'
                          : 'charcoal-40'
                      })`}
                    />
                  )}
                  {/* pop up upgrade button  */}
                  {/* {mediaList[item]?.isUnlocked === false && (
                    <CustomButton
                      text={'Upgrade'}
                      width={'160px'}
                      height={'30px'}
                      textColor={primaryColor === 'rhyno' ? '#222021' : 'white'}
                      onClick={() => setFirstStepPopUp(true)}
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
                  </Popup> */}
                </div>
              </div>
              <div className="video-description-wrapper">
                <h4>About this collection:</h4>
                {mediaList[item].description && (
                  <p>{mediaList[item].description}</p>
                )}
              </div>
              {/* this is the part of the block that has the nfts or some shit  */}
              {/* <div className="modal-nft-link-wrappers">
                <span className="text-white mt-5">Unlocked by NFTs from:</span>
                {mediaList[item]?.unlockData?.offers?.map((offer, index) => (
                  <OfferBuyButton key={index} {...offer} />
                ))}
                {mediaList[item]?.isUnlocked === false && (
                  <div className="more-info-wrapper">
                    <span className="more-info-text">
                      These NFTs unlock this video:
                    </span>
                    <div className="more-info">
                      {availableToken.length > 0 ? (
                        availableToken.map((token) => {
                          // eslint-disable-next-line
                          console.log('token', token);
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
                          In this collection we don&apos;t have any tokens
                          available for sale, sorry.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </Modal>
        </>
      </div>
    </button>
  );
};

export default VideoItem;
