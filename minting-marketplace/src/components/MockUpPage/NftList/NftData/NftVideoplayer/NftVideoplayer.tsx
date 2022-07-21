//@ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import videojs from 'video.js';
import Swal from 'sweetalert2';
import setDocumentTitle from '../../../../../utils/setTitle';
import axios from 'axios';
import {
  TAuthGetChallengeResponse,
  TOnlySuccessResponse
} from '../../../../../axios.responseTypes';

const NftVideoplayer = ({ selectVideo, main }) => {
  // console.log(selectVideo, 'selectVideo');
  // const params = useParams();
  // const navigate = useNavigate();
  const mainManifest = 'stream.m3u8';

  const { programmaticProvider } = useSelector((state) => state.contractStore);

  const [videoName] = useState(Math.round(Math.random() * 10000));
  const [mediaAddress, setMediaAddress] = useState(
    Math.round(Math.random() * 10000)
  );

  // const btnGoBack = () => {
  // 	navigate(-1);
  // }

  const requestChallenge = useCallback(async () => {
    let signature;
    let parsedResponse;
    if (window.ethereum) {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const response = await axios.get<TAuthGetChallengeResponse>(
        '/api/auth/get_challenge/' + account
      );
      parsedResponse = JSON.parse(response.data.response);
      signature = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [account, response.data.response],
        from: account
      });
    } else if (programmaticProvider) {
      const response = await axios.get<TAuthGetChallengeResponse>(
        '/api/auth/get_challenge/' + programmaticProvider.address
      );
      parsedResponse = JSON.parse(response.data.response);
      // EIP712Domain is added automatically by Ethers.js!
      const { /*EIP712Domain,*/ ...revisedTypes } = parsedResponse.types;
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
          selectVideo._id
      );
      if (streamAddress.data.success) {
        await setMediaAddress(
          '/stream/' + selectVideo._id + '/' + mainManifest
        );
        setTimeout(() => {
          videojs('vjs-' + videoName);
        }, 1000);
      }
    } catch (requestError) {
      //console.error(requestError);
      Swal.fire('NFT required to view this content');
    }
  }, [programmaticProvider, selectVideo._id, mainManifest, videoName]);

  useEffect(() => {
    requestChallenge();
    return () => {
      setMediaAddress();
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
            <source
              // autostart="false"
              src={mediaAddress}
              type="application/x-mpegURL"
            />
          </video>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className=""
          style={{
            width: '40vw',
            height: '406px'
          }}>
          <video
            id={'vjs-' + videoName}
            style={{
              width: 'inherit',
              height: 'inherit',
              borderRadius: '16px'
            }}
            className="video-js "
            controls
            preload="auto"
            autoPlay
            //poster={ video && ('/thumbnails/' + video.thumbnail + '.png') }
            data-setup="{}">
            <source src={mediaAddress} type="application/x-mpegURL" />
          </video>
        </div>
      </>
    );
  }
};

export default NftVideoplayer;
