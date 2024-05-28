import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Provider, useSelector, useStore } from 'react-redux';

import { TFileType } from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../../../ducks/users/users.types';
import useSwal from '../../../../hooks/useSwal';
import { playImagesColored } from '../../../SplashPage/images/greyMan/grayMan';
import YotiPage from '../../../YotiPage/YotiPage';
import { TUnlockableVideosSingleTokenPage } from '../../mockupPage.types';

import NftVideoplayer from './NftVideoplayer/NftVideoplayer';

const UnlockableVideosSingleTokenPage: React.FC<
  TUnlockableVideosSingleTokenPage
> = ({
  productsFromOffer,
  selectVideo,
  setSelectVideo,
  openVideoplayer,
  setOpenVideoPlayer,
  handlePlayerClick,
  primaryColor
}) => {
  const videosListBlock = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<
    TFileType | null | undefined
  >(undefined);

  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const store = useStore();

  const { userData } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const [formatedVideoObj, setFormatedVideoObj] = useState(undefined);
  const reactSwal = useSwal();

  function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map((key) => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  const ageVerificationPopUp = useCallback(() => {
    if (
      selectVideo &&
      selectVideo?.ageRestricted === true &&
      (userData?.ageVerified === false || !userData?.ageVerified)
    ) {
      reactSwal.fire({
        html: (
          <Provider store={store}>
            <YotiPage setOpenVideoplayer={setOpenVideoPlayer} />
          </Provider>
        ),
        showConfirmButton: false,
        width: '750px',
        customClass: {
          popup: `yoti-bg-color`
        }
      });
    } else {
      if (selectVideo?.isUnlocked) {
        handlePlayerClick();
      } else {
        reactSwal.fire({
          title: 'Info!',
          html: 'This video is available for NFT owner',
          icon: 'info'
        });
      }
    }
  }, [
    selectVideo,
    userData?.ageVerified,
    reactSwal,
    store,
    setOpenVideoPlayer,
    handlePlayerClick
  ]);

  useEffect(() => {
    if (productsFromOffer && productsFromOffer.length > 0) {
      let newArray: any = [];
      productsFromOffer.forEach((item) => {
        if (item) {
          newArray = [...newArray, item._id];
          // newArray.push(item._id);
        }
      });
      const result = renameKeys(productsFromOffer, newArray);
      setFormatedVideoObj(result);
    }
  }, [productsFromOffer]);

  useEffect(() => {
    setSelectVideo(selectVideo); // This will always use latest value of count
  }, [setSelectVideo, selectVideo]);

  useEffect(() => {
    if (productsFromOffer) {
      setSelectVideo(productsFromOffer[0]);
    }
  }, [productsFromOffer, setSelectVideo]);

  const handleSelectedItem = (itemSelected: TFileType) => {
    setSelectedItem(itemSelected);
  };
  return (
    <div className="unlockable-videos-wrapper" ref={videosListBlock}>
      {productsFromOffer && productsFromOffer.length && openVideoplayer ? (
        <div className={'video-player-style'}>
          {selectVideo && formatedVideoObj && (
            <NftVideoplayer
              selectVideo={formatedVideoObj[selectVideo._id]}
              setSelectVideo={setSelectVideo}
            />
          )}
        </div>
      ) : (
        <div className="unlockables-video-player-container">
          <img
            src={playImagesColored}
            className="unlockables-video-player-circle"
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
          />
          <div
            className="unlockables-video-player"
            style={{
              backgroundImage: `url(${selectVideo?.staticThumbnail})`
            }}></div>
        </div>
      )}
      <div className={'unlockables-videos-list'}>
        {productsFromOffer?.length &&
          productsFromOffer.map((data: TFileType, index) => {
            return (
              <div
                className={
                  selectedItem?._id === data._id
                    ? 'unlockables-videos-list-container'
                    : ''
                }
                key={index}>
                <div
                  onClick={() => {
                    setSelectVideo(data);
                    setOpenVideoPlayer(false);
                    handleSelectedItem(data);
                  }}
                  className={'single-list-video-wrapper'}>
                  <div
                    className={'single-list-video'}
                    style={{
                      backgroundImage: `url(${data.staticThumbnail})`
                    }}>
                    <div
                      className={`video-title-info-wrapper ${
                        data.isUnlocked && 'play'
                      } `}>
                      {data.isUnlocked ? (
                        <>
                          <div className="video-lock-round">
                            <img
                              width={'35px'}
                              height={'35px'}
                              src={playImagesColored}
                              className="video-single-token-unlock-play-circle"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {!data.demo ? (
                            <>
                              <div className="video-lock-round">
                                {/* <LockWhite /> */}
                              </div>
                              <div className="video-lock-round-text">
                                Locked
                              </div>
                            </>
                          ) : (
                            <div className="video-lock-round-text">Free</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className={'single-list-video-info'}
                    style={{
                      backgroundColor:
                        primaryColor === 'rhyno'
                          ? '#f8f8f8'
                          : `color-mix(in srgb, ${primaryColor}, #888888)`
                    }}>
                    <div
                      className="single-list-video-info-title"
                      style={{
                        color:
                          primaryColor === 'rhyno'
                            ? 'var(--charcoal)'
                            : '#FFFFFF'
                      }}>
                      {data.title}
                    </div>
                    <div
                      className="single-list-video-info-duration"
                      style={{
                        color:
                          primaryColor === 'rhyno'
                            ? 'var(--charcoal-60)'
                            : 'var(--charcoal-40)'
                      }}>
                      {data.duration}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default memo(UnlockableVideosSingleTokenPage);
