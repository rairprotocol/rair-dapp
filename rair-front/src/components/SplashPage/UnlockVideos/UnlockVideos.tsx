import React from 'react';

import UnlockVideoItem from './UnlockVideoItem';

import { IUnlockVideos, TVideoArrType } from '../splashPage.types';

const videoArr: TVideoArrType[] = [
  {
    typeVideo: 'Sneak Preview Coming Soon',
    unlockVideoName: 'Intro',
    timeVideo: '000:TBO:00',
    locked: true
  },
  {
    typeVideo: 'ipseyverse Exclusive',
    unlockVideoName: 'Track 2',
    timeVideo: '00:TBO:00',
    locked: false
  },
  {
    typeVideo: 'ipseyverse Exclusive',
    unlockVideoName: 'Track 3',
    timeVideo: '00:04:02',
    locked: false
  },
  {
    typeVideo: 'ipseyverse Exclusive',
    unlockVideoName: 'Track 3',
    timeVideo: '00:TBO:00',
    locked: true
  },
  {
    typeVideo: 'ipseyverse Exclusive',
    unlockVideoName: 'Track 3',
    timeVideo: '00:TBO:00',
    locked: false
  },
  {
    typeVideo: 'ipseyverse Exclusive',
    unlockVideoName: 'Track 3',
    timeVideo: '00:TBO:00',
    locked: false
  },
  {
    typeVideo: 'ipseyverse Exclusive',
    unlockVideoName: 'Track 3',
    timeVideo: '00:TBO:00',
    locked: false
  },
  {
    typeVideo: 'Nipseyverse Exclusive',
    unlockVideoName: 'Track 3',
    timeVideo: '00:TBO:00',
    locked: false
  }
];

const UnlockVideos: React.FC<IUnlockVideos> = ({ unlockableVideo }) => {
  return (
    <div className="unlockble-video">
      <div className="title-gets">
        <h3>
          NFT exclusive <span className="text-gradient">streaming</span>
        </h3>
      </div>
      <div className="block-videos">
        {videoArr.map((video, index) => {
          return (
            <UnlockVideoItem
              key={index + video.unlockVideoName}
              unlockableVideo={unlockableVideo}
              nameVideo={video.unlockVideoName}
              timeVideo={video.timeVideo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UnlockVideos;
