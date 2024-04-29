import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import videojs from 'video.js';

import { IVideoPlayer } from './video.types';

import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';

const VideoPlayer: React.FC<IVideoPlayer> = ({
  mediaId,
  mainManifest = 'stream.m3u8',
  baseURL,
  setProcessDone = () => false
}) => {
  const [videoName] = useState(Math.round(Math.random() * 10000));
  const [mediaAddress, setMediaAddress] = useState<string>(
    `${baseURL}${mediaId}`
  );

  //https://storage.googleapis.com/rair-videos/
  //import.meta.env.VITE_IPFS_GATEWAY

  const requestChallenge = useCallback(async () => {
    setProcessDone(true);
    try {
      const unlockResponse = await rFetch('/api/auth/unlock/', {
        method: 'POST',
        body: JSON.stringify({
          type: 'file',
          fileId: mediaId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (unlockResponse.success) {
        setMediaAddress(`/stream/${mediaId}/${mainManifest}`);
        setTimeout(() => {
          videojs('vjs-' + videoName);
        }, 1000);
        setProcessDone(false);
      } else {
        console.error(unlockResponse);
        Swal.fire('NFT required to view this content');
        setProcessDone(false);
      }
    } catch (error) {
      Swal.fire('NFT required to view this content');
      setProcessDone(false);
    }
  }, [setProcessDone, mediaId, mainManifest, videoName]);

  useEffect(() => {
    requestChallenge();
    return () => {
      setMediaAddress('');
    };
  }, [requestChallenge]);

  useEffect(() => {
    setDocumentTitle('Streaming');
  }, [videoName]);

  useEffect(() => {
    return () => {
      axios.get('/api/auth/stream/out');
    };
  }, [videoName]);

  if (mediaAddress === '') {
    return <></>;
  }

  return (
    <>
      <div className="col-12 row mx-0 bg-secondary h1">
        <video
          id={'vjs-' + videoName}
          className="video-js vjs-16-9"
          controls
          preload="auto"
          data-setup="{}">
          <source src={mediaAddress} type="application/x-mpegURL" />
        </video>
      </div>
    </>
  );
};

export default VideoPlayer;
