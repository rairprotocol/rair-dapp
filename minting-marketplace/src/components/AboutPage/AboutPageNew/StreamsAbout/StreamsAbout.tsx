//@ts-nocheck
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { IStreamsAbout } from '../aboutPage.types';
import { RootState } from '../../../../ducks';
import { ColorStoreType } from '../../../../ducks/colors/colorStore.types';
import VideoPlayerView from '../../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import VideoBg_2 from './../../assets/video-bg_2.png';
import axios from 'axios';
import { TNftFilesResponse } from '../../../../axios.responseTypes';

const StreamsAbout: React.FC<IStreamsAbout> = ({ purchaseButton }) => {
  const whatSplashPage = 'about-page';
  const [allVideos, setAllVideos] = useState([]);
  const [selectVideo, setSelectVideo] = useState();
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const getAllVideos = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      '/api/nft/network/0x38/0xb6163454da87e9f3fd63683c5d476f7d067f75a2/0/files'
    );
    setAllVideos(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, []);

  useEffect(() => {
    getAllVideos();
  }, [getAllVideos]);

  return (
    <div className="about-streams-video">
      <div className="join-community">
        <div className="title-join">
          <h3>
            Test our <span className="text-gradient">streams</span>
          </h3>
        </div>
        <div
          className={`community-description ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
          <div
            className={`community-text ${
              primaryColor === 'rhyno' ? 'rhyno' : ''
            }`}>
            <p>
              You’ll need <span>Metamask</span> and a watch token to play our
              encrypted streams. To stream the videos below you’ll need to mint
              a watch token for .1 MATIC
            </p>
            {purchaseButton}
          </div>
        </div>
      </div>
      <div className="tutorial-with-metamask">
        <div className="container-content-metamask">
          <div className="container-block-video">
            <VideoPlayerView
              productsFromOffer={allVideos}
              primaryColor={primaryColor}
              selectVideo={selectVideo}
              setSelectVideo={setSelectVideo}
              whatSplashPage={whatSplashPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsAbout;
