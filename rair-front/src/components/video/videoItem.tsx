import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Provider, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { faLock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { isAddress, ZeroAddress } from 'ethers';
import { useStateIfMounted } from 'use-state-if-mounted';

import { IVideoItem, TVideoItemContractData } from './video.types';

import { TUserResponse } from '../../axios.responseTypes';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { CustomModalStyle } from '../../types/commonTypes';
import { Offer, User } from '../../types/databaseTypes';
import formatDuration from '../../utils/durationUtils';
import { rFetch } from '../../utils/rFetch';
import { TooltipBox } from '../common/Tooltip/TooltipBox';
import NftVideoplayer from '../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
import { SvgLock } from '../MockUpPage/NftList/SvgLock';
import CustomButton from '../MockUpPage/utils/button/CustomButton';
import { ModalContentCloseBtn } from '../MockUpPage/utils/button/ShowMoreItems';
import { playImagesColored } from '../SplashPage/images/greyMan/grayMan';
import defaultAvatar from '../UserProfileSettings/images/defaultUserPictures.png';
import YotiPage from '../YotiPage/YotiPage';

Modal.setAppElement('#root');

const VideoItem: React.FC<IVideoItem> = ({ item }) => {
  const [offersArray, setOffersArray] = useState<Offer[]>([]);

  const { ageVerified } = useAppSelector((store) => store.user);

  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const navigate = useNavigate();
  // const [offerDataInfo,setOfferDataInfo] = useState<TOfferType[]>();
  const [contractData, setContractData] =
    useStateIfMounted<TVideoItemContractData | null>(null);
  const { width } = useWindowDimensions();

  const { primaryColor, textColor, primaryButtonColor, isDarkMode } =
    useAppSelector((store) => store.colors);

  const customStyles: CustomModalStyle = {
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
  const [dataUser, setDataUser] = useStateIfMounted<User | null>(null);
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
      item.ageRestricted === true &&
      (ageVerified === false || !ageVerified)
    ) {
      reactSwal.fire({
        html: (
          <Provider store={store}>
            <YotiPage setOpenVideoPlayer={setOpenVideoplayer} />
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
  }, [modalIsOpen, item, ageVerified, reactSwal, store]);

  const goToCollectionView = () => {
    if (offersArray.length > 0) {
      const productValue = offersArray[0].product;
      navigate(
        `/collection/${contractData?.blockchain}/${contractData?.contractAddress}/${productValue}/0`
      );
    }
  };

  const getInfo = useCallback(async () => {
    if (item.unlockData?.offers && item.unlockData?.offers.length > 0) {
      const firstOffer = item.unlockData.offers[0];
      setOffersArray(item.unlockData.offers);
      if (firstOffer.contract) {
        const { contract } = await rFetch(
          `/api/contracts/${firstOffer.contract}`
        );
        setContractData(contract);
      }
    }
  }, [item, setContractData]);

  const getInfoUser = useCallback(async () => {
    //# Optimize
    if (
      item.uploader &&
      isAddress(item.uploader) &&
      item.uploader !== ZeroAddress
    ) {
      const response = await axios.get<TUserResponse>(
        `/api/users/${item.uploader}`
      );
      setDataUser(response.data.user);
    }
  }, [item, setDataUser]);

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
      onMouseEnter={() => setHovering(item.animatedThumbnail !== '')}
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
          src={`${item.staticThumbnail}`}
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
          src={`${item.animatedThumbnail}`}
          style={{
            position: 'absolute',
            display: hovering ? 'block' : 'none',
            bottom: 0,
            borderRadius: '16px',
            background: 'black'
          }}
          className="col-12  h-100 w-100"
        />
        {item?.isUnlocked ? null : <SvgLock color={'white'} />}
      </div>
      <div className="col description-wrapper-video">
        <span className="description-title">
          {item.title.slice(0, 25)}
          {item.title.length > 26 ? '...' : ''}
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
                {formatDuration(item.duration)}
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
                isDarkMode={isDarkMode}
                onClick={closeModal}>
                <FontAwesomeIcon
                  icon={faTimes}
                  style={{
                    lineHeight: 'inherit',
                    color:
                      import.meta.env.VITE_TESTNET === 'true'
                        ? `${
                            textColor === '#FFF' || textColor === 'black'
                              ? '#F95631'
                              : textColor
                          }`
                        : `${
                            textColor === '#FFF' || textColor === 'black'
                              ? '#E882D5'
                              : textColor
                          }`
                  }}
                />
              </ModalContentCloseBtn>
            </div>
            <div
              className={`${
                primaryColor !== 'rhyno' && 'text-white'
              } modal-content-wrapper-for-video ${
                item?.isUnlocked && !owned ? 'unlocked' : 'locked'
              }`}>
              <div className="modal-content-video">
                {item?.isUnlocked === false && !owned ? (
                  <>
                    <TooltipBox
                      enterDelay={200}
                      title="You Need to Buy This NFT!">
                      <FontAwesomeIcon
                        icon={faLock}
                        data-title="You Need to Buy This NFT!"
                        className="modal-content-video-lock"
                      />
                    </TooltipBox>
                  </>
                ) : openVideoplayer ? (
                  <NftVideoplayer selectVideo={item} />
                ) : (
                  <>
                    <div className="modal-content-play-image-container">
                      <div>
                        <img
                          onClick={() => {
                            if (currentUserAddress) {
                              ageVerificationPopUp();
                            } else {
                              reactSwal.fire({
                                title: 'Login required',
                                icon: 'info'
                              });
                            }
                          }}
                          className={'modal-content-play-image'}
                          src={playImagesColored}
                          alt="Button play video"
                        />
                      </div>
                    </div>
                  </>
                )}
                {!openVideoplayer && !!item.staticThumbnail && (
                  <img
                    alt="Video thumbnail"
                    src={`${item.staticThumbnail}`}
                    className={`modal-content-video-thumbnail ${
                      !item.isUnlocked && !owned ? 'video-locked-modal' : ''
                    }`}
                  />
                )}
              </div>
              <div className="title-name-internal-options-wrapper">
                <div
                  className={`title-and-username-wrapper-for-video-modal popup-video-player-mobile-title ${
                    primaryColor === 'rhyno' ? 'rhyno' : ''
                  }`}>
                  <div className="title-of-video">
                    {item && <h3>{item.title}</h3>}
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
                      textColor={textColor}
                      onClick={goToCollectionView}
                      custom={false}
                      background={primaryButtonColor}
                    />
                  )}
                </div>
              </div>
              <div className="video-description-wrapper">
                <b>Description</b>
                {item.description && <p>{item.description}</p>}
              </div>
            </div>
          </Modal>
        </>
      </div>
    </button>
  );
};

export default VideoItem;
