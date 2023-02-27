import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import videojs from 'video.js';

import NewVideo from './NewVideo';

import { TOnlySuccessResponse } from '../../../../../axios.responseTypes';
import { rFetch } from '../../../../../utils/rFetch';
import setDocumentTitle from '../../../../../utils/setTitle';
import { INftVideoplayer } from '../../../mockupPage.types';

const NftVideoplayer: React.FC<INftVideoplayer> = ({
  selectVideo,
  // main,
  setSelectVideo
}) => {
  const mainManifest = 'stream.m3u8';

  const [videoName] = useState<number>(Math.round(Math.random() * 10000));
  const [mediaAddress, setMediaAddress] = useState<string>('');
  const requestChallenge = useCallback(async () => {
    try {
      const streamAddress = await rFetch('/api/v2/auth/unlock/', {
        method: 'POST',
        body: JSON.stringify({
          type: 'file',
          fileId: selectVideo?._id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (streamAddress.success) {
        setMediaAddress(`/stream/${selectVideo?._id}/${mainManifest}`);
        setTimeout(() => {
          videojs('vjs-' + videoName);
        }, 1000);
      }
    } catch (requestError) {
      Swal.fire('NFT required to view this content');
    }
  }, [selectVideo, mainManifest, videoName]);

  useEffect(() => {
    requestChallenge();
    return () => {
      setMediaAddress('');
    };
  }, [selectVideo, setSelectVideo, requestChallenge]);

  useEffect(() => {
    setDocumentTitle('Streaming');
  }, [videoName]);

  useEffect(() => {
    return () => {
      axios.get<TOnlySuccessResponse>('/api/auth/stream/out');
    };
  }, [videoName]);

  if (mediaAddress.length > 0) {
    return (
      <>
        <div className="col-12 row mx-0 h1">
          <NewVideo
            videoData={mediaAddress}
            selectVideo={selectVideo}
            videoIdName={videoName}
          />
        </div>
      </>
    );
  } else {
    return (
      <div style={{ paddingTop: '20%' }}>
        <div className="loader-wrapper">
          <div className="load" />
        </div>
      </div>
    );
  }
};

export default NftVideoplayer;
