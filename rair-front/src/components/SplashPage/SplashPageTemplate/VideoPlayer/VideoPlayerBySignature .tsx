import React, { useEffect } from 'react';

import setDocumentTitle from '../../../../utils/setTitle';
import { IVideoPlayerBySignature, IVideoWindow } from '../../splashPage.types';

import './VideoPlayer.css';

const VideoWindow: React.FC<IVideoWindow> = ({ mediaAddress }) => {
  return (
    <div
      className="col-12 row mx-0 h1"
      style={{
        justifyContent: 'center'
      }}>
      <video className="video-player" controls preload="auto" data-setup="{}">
        <source src={mediaAddress} type="video/mp4" />
      </video>
    </div>
  );
};

const VideoWindowError = () => {
  return (
    <div className="col-12 row mx-0 bg-secondary h1">
      <p className="video-window-error">
        {' '}
        Metamask Signature Required to Access Video
      </p>
    </div>
  );
};

const VideoPlayerBySignature: React.FC<IVideoPlayerBySignature> = ({
  mediaAddress
}) => {
  const signature = true;
  useEffect(() => {
    setDocumentTitle('Streaming');
  }, []);

  return (
    <>
      {signature ? (
        <VideoWindow mediaAddress={mediaAddress} />
      ) : (
        <VideoWindowError />
      )}
    </>
  );
};

export default VideoPlayerBySignature;
