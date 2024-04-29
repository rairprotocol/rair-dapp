import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

import { VideoPlayerParams } from './video.types';

import { TOnlySuccessResponse } from '../../axios.responseTypes';
import useSwal from '../../hooks/useSwal';
import { rFetch } from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';
import NewVideo from '../MockUpPage/NftList/NftData/NftVideoplayer/NewVideo';

const VideoPlayer = () => {
  const params = useParams<VideoPlayerParams>();
  const { /*contract,*/ mainManifest, videoId } = params;
  const [videoName] = useState(videoId);
  const [mediaAddress, setMediaAddress] = useState<string | null>('');

  const reactSwal = useSwal();

  const requestChallenge = useCallback(async () => {
    try {
      const unlockResponse = await rFetch('/api/auth/unlock/', {
        method: 'POST',
        body: JSON.stringify({
          type: 'file',
          fileId: videoId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (unlockResponse.success) {
        setMediaAddress(`/stream/${videoId}/${mainManifest}`);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error(error.message);
      reactSwal.fire({
        title: 'NFT required to view this content'
      });
    }
  }, [mainManifest, reactSwal, videoId]);

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
      axios.get<TOnlySuccessResponse>('/api/auth/stream/out');
    };
  }, [videoName]);

  return (
    <div
      className="col-12 row mx-0 h1 iframe-video-player"
      onClick={() => {
        if (mediaAddress === '') {
          requestChallenge();
        }
      }}
      style={{ minHeight: '100vh' }}>
      {mediaAddress !== '' && (
        <NewVideo
          videoData={mediaAddress}
          selectVideo={''}
          videoIdName={videoName}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
