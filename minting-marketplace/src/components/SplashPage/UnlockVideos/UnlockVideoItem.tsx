//@ts-nocheck
import React from 'react';
import Metamask from '../images/metamask_logo.png';

const UnlockVideoItem = ({
  // typeVideo,
  nameVideo,
  timeVideo,
  UnlockableVideo,
  // locked,
  primaryColor
}) => {
  return (
    <div className="box-video">
      <div
        className="video-locked"
        style={{
          background: `${primaryColor === 'rhyno' ? '#fff' : '#4E4D4DCC'}`
        }}>
        <div className="block-with-video" style={{ position: 'relative' }}>
          <div className="video-block-metamask-some">
            <img src={Metamask} alt="metamask-logo" />
          </div>
          <img
            className="block-img-bg"
            src={UnlockableVideo}
            alt="Preview unlockable video"
          />
        </div>
        <div className="video-description">
          <div className="video-title">
            <p
              style={{
                color: `${primaryColor === 'rhyno' ? '#000' : '#fff'}`
              }}>
              {nameVideo}
            </p>
          </div>
          <div className="video-timer">
            <p
              style={{
                color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
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
