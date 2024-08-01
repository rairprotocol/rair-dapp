import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Provider, useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { faLock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { constants, utils } from 'ethers';
import { useStateIfMounted } from 'use-state-if-mounted';

import { IVideoItem, TVideoItemContractData } from './video.types';

import { TUserResponse } from '../../axios.responseTypes';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { TUsersInitialState, UserType } from '../../ducks/users/users.types';
import useSwal from '../../hooks/useSwal';
import useWindowDimensions from '../../hooks/useWindowDimensions';
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

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const navigate = useNavigate();
  // const [offerDataInfo,setOfferDataInfo] = useState<TOfferType[]>();
  const [contractData, setContractData] =
    useStateIfMounted<TVideoItemContractData | null>(null);
  const { width } = useWindowDimensions();

  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
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
      (userData?.ageVerified === false || !userData?.ageVerified)
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
        `/api/files/${mediaList[item]._id}/unlocks`
      );

      if (data?.offers && data.offers.length > 0) {
        const firstOffer = data.offers[0];

        if (firstOffer.contract?._id) {
          const { contract } = await rFetch(
            `/api/contracts/${firstOffer.contract._id}`
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
              <ModalContentCloseBtn
                primaryColor={primaryColor}
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
                mediaList[item]?.isUnlocked && !owned ? 'unlocked' : 'locked'
              }`}>
              <div className="modal-content-video">
                {mediaList[item]?.isUnlocked === false && !owned ? (
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
                  <NftVideoplayer selectVideo={mediaList[item]} />
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
                </div>
              </div>
              <div className="video-description-wrapper">
                <h4>About this collection:</h4>
                {mediaList[item].description && (
                  <p>{mediaList[item].description}</p>
                )}
              </div>
            </div>
          </Modal>
        </>
      </div>
    </button>
  );
};

export default VideoItem;
