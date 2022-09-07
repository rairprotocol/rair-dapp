import React, { memo, useEffect, useRef, useState } from 'react';
import { TFileType } from '../../../../axios.responseTypes';
import { IUnlockableVideosSingleTokenPage } from '../../mockupPage.types';
import { ReactComponent as PlayCircle } from '../../assets/PlayCircle.svg';
import { ReactComponent as LockWhite } from '../../assets/LockWhite.svg';
import NftVideoplayer from './NftVideoplayer/NftVideoplayer';

const UnlockableVideosSingleTokenPage: React.FC<
  IUnlockableVideosSingleTokenPage
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
  const [selectedItem, setSelectedItem] = useState<TFileType | null>(
    productsFromOffer[0]
  );

  useEffect(() => {
    setSelectVideo(selectVideo); // This will always use latest value of count
  }, [setSelectVideo, selectVideo]);

  const handleSelectedItem = (itemSelected: TFileType) => {
    setSelectedItem(itemSelected);
  };
  return (
    <div className="unlockable-videos-wrapper" ref={videosListBlock}>
      {productsFromOffer.length && openVideoplayer ? (
        <div className={'video-player-style'}>
          <NftVideoplayer
            selectVideo={selectVideo}
            setSelectVideo={setSelectVideo}
          />
        </div>
      ) : (
        <div className="unlockables-video-player-container">
          <PlayCircle
            className="unlockables-video-player-circle"
            onClick={handlePlayerClick}
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
          productsFromOffer.map((data: TFileType) => {
            return (
              <div
                className={
                  selectedItem?._id === data._id
                    ? 'unlockables-videos-list-container'
                    : ''
                }
                key={data._id}>
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
                            <PlayCircle
                              className="video-single-token-unlock-play-circle"
                              width={'35px'}
                              height={'35px'}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {!data.demo ? (
                            <>
                              <div className="video-lock-round">
                                <LockWhite />
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
                          : 'var(--charcoal-80)'
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
