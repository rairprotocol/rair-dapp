//@ts-nocheck
import React, { useState } from "react";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { playImagesColored } from "../../../../SplashPage/images/greyMan/grayMan";
import {
  IVideoPlayerView,
  TVideoPlayerViewSpecialVideoType,
} from "../../nftList.types";
import NftVideoplayer from "../NftVideoplayer/NftVideoplayer";

import cl from "./VideoPlayerView.module.css";

const VideoPlayerView: React.FC<IVideoPlayerView> = ({
  productsFromOffer,
  primaryColor,
  selectVideo,
  setSelectVideo,
  whatSplashPage,
  someAdditionalData,
  unlockables,
}) => {
  const [openVideoplayer, setOpenVideoplayer] = useState<boolean>(false);
  const [selectedBg, setSelectedBg] = useState<string>();

  return (
    <div
      className={
        unlockables
          ? cl.VideoPlayerViewWrapperUnlockables
          : cl.VideoPlayerViewWrapper
      }
      style={{
        background: `${primaryColor === "rhyno" ? "#F2F2F2" : "#383637"}`,
      }}
    >
      <div className={cl.ListOfVideosWrapper}>
        {whatSplashPage &&
          someAdditionalData &&
          someAdditionalData.map(
            (data: TVideoPlayerViewSpecialVideoType, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectVideo(data);
                    setOpenVideoplayer(false);
                    setSelectedBg(data.VideoBg);
                  }}
                  style={{
                    backgroundImage: `url(${data.VideoBg})`,
                  }}
                  className={cl.ListOfVideosOneVideo}
                >
                  <div className={cl.previewWrapper}>
                    <span className={cl.preview}>Preview</span>
                    <FontAwesomeIcon
                      style={{ color: `red` }}
                      icon={faKey}
                      className={cl.iconKey}
                    />
                  </div>
                  <div className={cl.play}>
                    <button
                      style={{ border: "none", background: "none" }}
                      className=""
                    >
                      <img
                        className={cl.playImagesColoredOnListVideos}
                        src={playImagesColored}
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
            }
          )}
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
                  backgroundImage: `url(${data?.staticThumbnail})`,
                }}
                className={cl.ListOfVideosOneVideo}
              >
                <div className={cl.previewWrapper}>
                  <span className={cl.preview}>Preview</span>
                  <FontAwesomeIcon icon={faKey} className={cl.iconKey} />
                </div>
                <div className={cl.play}>
                  <button
                    style={{ border: "none", background: "none" }}
                    className=""
                  >
                    <img
                      className={cl.playImagesOnListVideos}
                      src={playImagesColored}
                      alt="Button Play video"
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
                })`,
              }}
              className={
                whatSplashPage ? cl.forSplashPageStyleOneVideo : cl.SingleVideo
              }
            >
              <img
                className={cl.playImagesOnSingleVideo}
                src={playImagesColored}
                alt="Button Play video"
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
                    })`,
                  }}
                  className={
                    whatSplashPage
                      ? cl.forSplashPageStyleOneVideo
                      : cl.SingleVideo
                  }
                >
                  <img
                    className={cl.playImagesColoredOnSingleVideo}
                    src={playImagesColored}
                    alt="Button Play video"
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
