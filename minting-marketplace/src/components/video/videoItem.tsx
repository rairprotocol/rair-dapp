import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useStateIfMounted } from 'use-state-if-mounted';

import { IVideoItem } from './video.types';
import OfferBuyButton from './videoOfferBuy';

import { TTokenData, TUserResponse } from '../../axios.responseTypes';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { UserType } from '../../ducks/users/users.types';
import formatDuration from '../../utils/durationUtils';
import { rFetch } from '../../utils/rFetch';
import { TooltipBox } from '../common/Tooltip/TooltipBox';
import { ImageLazy } from '../MockUpPage/ImageLazy/ImageLazy';
import NftVideoplayer from '../MockUpPage/NftList/NftData/NftVideoplayer/NftVideoplayer';
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
  const loading = useSelector<RootState, boolean>(
    (state) => state.videosStore.loading
  );

  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const customStyles = {
    overlay: {
      zIndex: '4'
    },
    content: {
      background: primaryColor === 'rhyno' ? '#F2F2F2' : '#383637',
      top: '50%',
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
      borderRadius: '16px'
    }
  };

  const availableToken: TTokenData[] = [];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalHelp, setModalHelp] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [owned /*setOwned*/] = useState(false);
  const [openVideoplayer, setOpenVideoplayer] = useState(false);
  const [dataUser, setDataUser] = useStateIfMounted<UserType | null>(null);

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

  // const goToUnlockView = () => {
  //   navigate(
  //     `/unlockables/${contractData?.blockchain}/${contractData?.contractAddress}/${mediaList[item]?.product}/0`
  //   );
  // };

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
                    <img
                      onClick={() => setOpenVideoplayer(true)}
                      className={'modal-content-play-image'}
                      src={playImagesColored}
                      alt="Button play video"
                    />
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
              <div className="modal-content-video-choice">
                <div className="modal-content-block-btns">
                  <div className="modal-content-block-buy">
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
                </div>
              </div>
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
