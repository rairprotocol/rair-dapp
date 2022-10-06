import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';

import { TAuthGetChallengeResponse } from '../../../../axios.responseTypes';
import { RootState } from '../../../../ducks';
import { ContractsInitialType } from '../../../../ducks/contracts/contracts.types';
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
  const { programmaticProvider, currentUserAddress } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);
  const [signature, setSignature] = useState(null);

  const requestChallenge = useCallback(async () => {
    let sign;
    let parsedResponse;

    if (window.ethereum) {
      const account = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      const response = await axios.post<TAuthGetChallengeResponse>(
        '/api/auth/get_challenge/',
        {
          userAddress: currentUserAddress,
          intent: 'decrypt',
          mediaId: mediaAddress
        }
      );
      parsedResponse = JSON.parse(response.data.response);
      try {
        sign = await window.ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [account, response.data.response],
          from: account
        });
        setSignature(sign);
      } catch (error) {
        console.error(error);
        Swal.fire(
          'Error',
          'MetaMask signature required to stream video',
          'error'
        );
      }
    } else if (programmaticProvider) {
      const response = await axios.get<TAuthGetChallengeResponse>(
        '/api/auth/get_challenge/' + programmaticProvider.address
      );
      parsedResponse = JSON.parse(response.data.response);
      const { /*EIP712Domain,*/ ...revisedTypes } = parsedResponse.types;
      try {
        sign = await programmaticProvider._signTypedData(
          parsedResponse.domain,
          revisedTypes,
          parsedResponse.message
        );
        setSignature(sign);
      } catch (error) {
        console.error(error);
        Swal.fire(
          'Error',
          'MetaMask signature required to stream video',
          'error'
        );
      }
    } else {
      Swal.fire('Error', 'Unable to decrypt videos', 'error');
      return;
    }
  }, [programmaticProvider]);

  useEffect(() => {
    requestChallenge();
  }, [requestChallenge]);

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
