//@ts-nocheck
import React, { useState } from 'react';
import cl from './VideoPlayerView.module.css';
import playImages from '../../../../SplashPage/images/playImg.png';
import NftVideoplayer from '../NftVideoplayer/NftVideoplayer';
import { IVideoPlaterView } from './videoPlayerView.types';

const VideoPlayerView: React.FC<IVideoPlaterView> = ({
  productsFromOffer,
  primaryColor,
  selectVideo,
  setSelectVideo,
  whatSplashPage,
  someAdditionalData,
  unlockables
}) => {
  const [openVideoplayer, setOpenVideoplayer] = useState(false);
  const [selectedBg, setSelectedBg] = useState();

  const colorRarity = ['#E4476D', 'gold', 'silver'];

  return (
    <div
      className={
        unlockables
          ? cl.VideoPlayerViewWrapperUnlockables
          : cl.VideoPlayerViewWrapper
      }
      style={{
        background: `${primaryColor === 'rhyno' ? '#F2F2F2' : '#383637'}`
      }}>
      <div className={cl.ListOfVideosWrapper}>
        {whatSplashPage &&
          someAdditionalData &&
          someAdditionalData.map((data, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setSelectVideo(
                    data.VideoBg,
                    data.urlVideo,
                    data.mediaIdVideo
                  );
                  setOpenVideoplayer(false);
                  setSelectedBg(data.VideoBg);
                }}
                style={{
                  backgroundImage: `url(${data.VideoBg})`
                }}
                className={cl.ListOfVideosOneVideo}>
                <div className={cl.previewWrapper}>
                  <span className={cl.preview}>Preview</span>
                  <i
                    style={{ color: `red` }}
                    className={`fas fa-key ${cl.iconKey}`}
                  />
                </div>
                <div className={cl.play}>
                  <button
                    style={{ border: 'none', background: 'none' }}
                    className="">
                    <img
                      className={cl.playImagesOnListVideos}
                      src={playImages}
                      alt="Play"
                    />
                  </button>
                </div>
                <div className={cl.description}>
                  <strong>{data.videoName}</strong>
                  <span className={cl.duration}>{data.videoTime}</span>
                </div>
              </div>
            );
          })}
        {!!productsFromOffer?.length &&
          productsFromOffer.map((data) => {
            return (
              <div
                key={data._id}
                onClick={() => {
                  setSelectVideo(data);
                  setOpenVideoplayer(false);
                }}
                style={{
                  backgroundImage: `url(${data?.staticThumbnail})`
                }}
                className={cl.ListOfVideosOneVideo}>
                <div className={cl.previewWrapper}>
                  <span className={cl.preview}>Preview</span>
                  <i
                    style={{ color: `${colorRarity[data.offer[0]]}` }}
                    className={`fas fa-key ${cl.iconKey}`}
                  />
                </div>
                <div className={cl.play}>
                  <button
                    style={{ border: 'none', background: 'none' }}
                    className="">
                    <img
                      className={cl.playImagesOnListVideos}
                      src={playImages}
                      alt="Play"
                    />
                  </button>
                </div>
                <div className={cl.description}>
                  <strong>{data.description}</strong>
                  <span className={cl.duration}>{data.duration}</span>
                </div>
              </div>
            );
          })}
      </div>
      {productsFromOffer?.length ? (
        <div className={cl.SingleVideoWrapper}>
          {openVideoplayer ? (
            <NftVideoplayer selectVideo={selectVideo} />
          ) : (
            <div
              onClick={() => setOpenVideoplayer(true)}
              style={{
                backgroundImage: `url(${
                  selectVideo?.staticThumbnail || selectedBg
                })`
              }}
              className={
                whatSplashPage ? cl.forSplashPageStyleOneVideo : cl.SingleVideo
              }>
              <img
                className={cl.playImagesOnSingleVideo}
                src={playImages}
                alt="Play"
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={cl.SingleVideoWrapper}>
            {openVideoplayer ? (
              <NftVideoplayer selectVideo={selectVideo} />
            ) : (
              someAdditionalData && (
                <div
                  onClick={() => setOpenVideoplayer(true)}
                  style={{
                    backgroundImage: `url(${
                      selectedBg || someAdditionalData[0].VideoBg
                    })`
                  }}
                  className={
                    whatSplashPage
                      ? cl.forSplashPageStyleOneVideo
                      : cl.SingleVideo
                  }>
                  <img
                    className={cl.playImagesOnSingleVideo}
                    src={playImages}
                    alt="Play"
                  />
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayerView;
