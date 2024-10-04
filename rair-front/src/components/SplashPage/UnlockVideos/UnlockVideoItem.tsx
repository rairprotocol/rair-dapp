import { FC } from 'react';

import { useAppSelector } from '../../../hooks/useReduxHooks';
import { metaMaskIcon } from '../../../images';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import { IUnlockVideoItem } from '../splashPage.types';

const UnlockVideoItem: FC<IUnlockVideoItem> = ({
  nameVideo,
  timeVideo,
  unlockableVideo
}) => {
  const { isDarkMode } = useAppSelector((store) => store.colors);
  return (
    <div className="box-video">
      <div
        className="video-locked"
        style={{
          background: `${!isDarkMode ? '#fff' : '#4E4D4DCC'}`
        }}>
        <div className="block-with-video" style={{ position: 'relative' }}>
          <div className="video-block-metamask-some">
            <img src={metaMaskIcon} alt="metamask-logo" />
          </div>
          <ImageLazy
            className="block-img-bg"
            src={unlockableVideo}
            alt="Preview unlockable video"
          />
        </div>
        <div className="video-description">
          <div className="video-title">
            <p
              style={{
                color: `${!isDarkMode ? '#000' : '#fff'}`
              }}>
              {nameVideo}
            </p>
          </div>
          <div className="video-timer">
            <p
              style={{
                color: `${!isDarkMode ? '#000' : '#A7A6A6'}`
              }}>
              {timeVideo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockVideoItem;
