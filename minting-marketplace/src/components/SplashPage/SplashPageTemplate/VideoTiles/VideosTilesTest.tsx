//@ts-nocheck
//test page for video tiles
import videoBackground1 from '../../../SplashPage/images/nftnyc_videobackground1.png';
import VideoPlayerView from '../../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import VideoPlayerModule from '../VideoPlayer/VideoPlayerModule';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

/* for video player module */
const videoData = {
  videoTitle: '',
  videoModuleDescription:
    'NFT owners can learn more about the project by signing with metamask to unlock an encrypted stream ',
  videoModuleTitle: 'Exclusive 1: Degen Toonz Cartoon'
  // baseURL: 'https://storage.googleapis.com/rair-videos/',
  // mediaId: 'L9LkL4rNFowOl6pjuYcft8wNI66kgJY1vd4QzDtmTDQg9I',
  // demo: true,
};

/* for video player view */
const testContract = {
  contractAddress: '0x2436d9fe6aac5c30e2fb9753626cf0d89472a7ff',
  requiredBlockchain: '0x13881',
  offerIndex: [1]
};

//* for Video Tiles */
// const videoArr = [
//     {
//         videoName: "Welcome to NFTLA",
//         videoType: "NFTLA-EXCLUSIVE-1",
//         videoTime: "00:00:00",
//         videoSRC: NFTLA_Video,
//     },
//     {
//         videoName: "Ukraine Glitch",
//         videoType: "UKR-EXCLUSIVE-1",
//         videoTime: "00:00:00",
//         videoSRC: null,
//         baseURL: 'https://storage.googleapis.com/rair-videos/',
//         mediaId: 'VUPLZvYEertdAQMiZ4KTI9HgnX5fNSN036GAbKnj9XoXbJ',
//     },
//     {
//         videoName: "Greyman",
//         videoType: "NFTLA-EXCLUSIVE-3",
//         videoTime: "00:00:00",
//         videoSRC: null,
//         baseURL: 'https://storage.googleapis.com/rair-videos/',
//         mediaId: 'QmU8iCk2eE2V9BV6Bo6QiXEgQqER1zf4fnsnStNxH77KH8J',
//     },
//     {
//         videoName: "No Video",
//         videoType: "NFTLA-EXCLUSIVE-4",
//         videoTime: "00:00:00",
//         videoSRC: null,
//     }
// ]

const VideoTilesTest = ({ setIsSplashPage }) => {
  const { primaryColor } = useSelector((store) => store.colorStore);

  /* UTILITIES FOR VIDEO PLAYERS */
  const [productsFromOffer, setProductsFromOffer] = useState([]);
  const [selectVideo, setSelectVideo] = useState(productsFromOffer[0]);
  const [mainVideo, setMainVideo] = useState(productsFromOffer[0]);

  const getProductsFromOffer = async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${testContract.requiredBlockchain}/${testContract.contractAddress}/${testContract.offerIndex[0]}/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
    setMainVideo(response.data.files[0]);
  };

  useEffect(() => {
    getProductsFromOffer();
  }, []);

  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  /* */

  return (
    <>
      <VideoPlayerModule
        backgroundImage={videoBackground1}
        videoData={videoData}
        selectVideo={mainVideo}
      />

      {/* <VideoTiles title={"test"} videoArr={videoArr} primaryColor={primaryColor}/> */}
      <VideoPlayerView
        productsFromOffer={productsFromOffer}
        primaryColor={primaryColor}
        selectVideo={selectVideo}
        setSelectVideo={setSelectVideo}
      />
    </>
  );
};

export default VideoTilesTest;
