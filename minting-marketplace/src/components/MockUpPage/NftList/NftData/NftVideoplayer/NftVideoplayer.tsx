import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import videojs from 'video.js';
import Swal from 'sweetalert2';
import setDocumentTitle from '../../../../../utils/setTitle';
import axios from 'axios';
import {
  TAuthGetChallengeResponse,
  TOnlySuccessResponse
} from '../../../../../axios.responseTypes';
import { INftVideoplayer } from '../../../mockupPage.types';
import { RootState } from '../../../../../ducks';
import { ethers } from 'ethers';

const NftVideoplayer: React.FC<INftVideoplayer> = ({
  selectVideo,
  main,
  setSelectVideo
}) => {
  const mainManifest = 'stream.m3u8';

  const programmaticProvider = useSelector<
    RootState,
    ethers.Wallet | undefined
  >((state) => state.contractStore.programmaticProvider);

  const [videoName] = useState<number>(Math.round(Math.random() * 10000));
  const [mediaAddress, setMediaAddress] = useState<string>(
    String(Math.round(Math.random() * 10000))
  );
  const requestChallenge = useCallback(async () => {
    let signature;
    let parsedResponse;
    if (window.ethereum) {
      const account = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const response = await axios.get<TAuthGetChallengeResponse>(
        '/api/auth/get_challenge/' + account?.[0]
      );
      parsedResponse = JSON.parse(response.data.response);
      signature = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account?.[0], response.data.response],
        from: account?.[0]
      });
    } else if (programmaticProvider) {
      const response = await axios.get<TAuthGetChallengeResponse>(
        '/api/auth/get_challenge/' + programmaticProvider.address
      );
      parsedResponse = JSON.parse(response.data.response);
      // EIP712Domain is added automatically by Ethers.js!
      const { ...revisedTypes } = parsedResponse.types;
      signature = await programmaticProvider._signTypedData(
        parsedResponse.domain,
        revisedTypes,
        parsedResponse.message
      );
    } else {
      Swal.fire('Error', 'Unable to decrypt videos', 'error');
      return;
    }
    try {
      const streamAddress = await axios.get<TOnlySuccessResponse>(
        '/api/auth/get_token/' +
          parsedResponse.message.challenge +
          '/' +
          signature +
          '/' +
          selectVideo?._id
      );
      if (streamAddress.data.success) {
        await setMediaAddress(
          '/stream/' + selectVideo?._id + '/' + mainManifest
        );
        setTimeout(() => {
          videojs('vjs-' + videoName);
        }, 1000);
      }
    } catch (requestError) {
      Swal.fire('NFT required to view this content');
    }
  }, [programmaticProvider, selectVideo, mainManifest, videoName]);

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

  if (main) {
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
  } else {
    return (
      <>
        <div className="nft-video-player-video">
          <video
            id={'vjs-' + videoName}
            style={{
              borderRadius: '16px'
            }}
            className="video-js"
            controls
            preload="auto"
            autoPlay
            data-setup="{}">
            <source src={mediaAddress} type="application/x-mpegURL" />
          </video>
        </div>
      </>
    );
  }
};

export default NftVideoplayer;
