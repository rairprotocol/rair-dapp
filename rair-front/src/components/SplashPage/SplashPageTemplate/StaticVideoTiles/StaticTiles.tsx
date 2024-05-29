//@ts-nocheck
//unused-component
import React from 'react';

import UnlockVideoItem from '../../UnlockVideos/UnlockVideoItem';

import './StaticTiles.css';

const videoArr = [
  {
    typeVideo: 'NFTLA-EXCLUSIVE-1',
    unlockVideoName: 'Welcome to NFTLA',
    timeVideo: '00:00:00',
    locked: true
  },
  {
    typeVideo: 'NFTLA-EXCLUSIVE-2',
    unlockVideoName: 'Speaker: Bun B',
    timeVideo: '00:00:00',
    locked: false
  },
  {
    typeVideo: 'NFTLA-EXCLUSIVE-3',
    unlockVideoName: 'Speaker: Dr. Peace Uche',
    timeVideo: '00:00:00',
    locked: false
  },
  {
    typeVideo: 'NFTLA-EXCLUSIVE-4',
    unlockVideoName: 'Closing Cermonies',
    timeVideo: '00:00:00',
    locked: true
  }
];

const StaticTiles = ({ title, UnlockableVideo, primaryColor }) => {
  return (
    <div
      className="unlockble-video"
      style={{
        marginBottom: '108px',
        width: '100%'
      }}>
      <div
        className="title-gets"
        style={{
          textAlign: 'center'
        }}>
        <h3> {title} </h3>
      </div>
      <div className="block-videos">
        {videoArr.map((video, index) => {
          return (
            <UnlockVideoItem
              key={index + video.unlockVideoName}
              unlockableVideo={UnlockableVideo}
              typeVideo={video.typeVideo}
              nameVideo={video.unlockVideoName}
              timeVideo={video.timeVideo}
              locked={video.locked}
              primaryColor={primaryColor}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StaticTiles;
