//@ts-nocheck
import React from 'react';

import VideoTilesItem from './VideoTilesItem';

import './VideoTiles.css';

const VideoTiles = ({ title, videoArr, primaryColor, backgroundImage }) => {
  return (
    <div className="unlockable-video">
      <div className="title-gets">
        <h3> {title} </h3>
      </div>
      <div className="block-videos">
        {videoArr.map((video, index) => {
          const {
            videoName,
            videoType,
            videoTime,
            videoSRC,
            baseURL,
            mediaId,
            demo
          } = video;
          return (
            <VideoTilesItem
              backgroundImage={backgroundImage}
              key={index + videoName}
              demo={demo}
              videoType={videoType}
              videoName={videoName}
              videoTime={videoTime}
              videoSRC={videoSRC}
              baseURL={baseURL}
              mediaId={mediaId}
              primaryColor={primaryColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VideoTiles;
