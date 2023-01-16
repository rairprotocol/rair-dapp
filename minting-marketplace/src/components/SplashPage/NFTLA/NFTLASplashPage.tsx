//@ts-nocheck
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { teamNFTLAarray } from './AboutUsTeam';
import { ISplashPageProps, TNftLaSelectedVideo } from './splashPage.types';

import { TFileType } from '../../../axios.responseTypes';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import { splashData } from '../../../utils/infoSplashData/nftla';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import { TVideoPlayerViewSpecialVideoType } from '../../MockUpPage/NftList/nftList.types';
import MetaTags from '../../SeoTags/MetaTags';
/* importing images*/
import { NFTLA1, NFTLA2, NFTLA3 } from '../images/NFTLA/nftLA';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import SplashCardButton from '../SplashPageConfig/CardBlock/CardButton/SplashCardButton';
import { handleReactSwal } from '../SplashPageConfig/utils/reactSwalModal';
import UnlockableVideosWrapper from '../SplashPageConfig/VideoBlock/UnlockableVideosWrapper/UnlockableVideosWrapper';
import SplashVideoWrapper from '../SplashPageConfig/VideoBlock/VideoBlockWrapper/SplashVideoWrapper';
import SplashVideoTextBlock from '../SplashPageConfig/VideoBlock/VideoTextBlock/SplashVideoTextBlock';
import { useGetProducts } from '../splashPageProductsHook';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import ListExlusiveProduct from '../SplashPageTemplate/ListExlusiveProduct/ListExlusiveProduct';
import VideoPlayerModule from '../SplashPageTemplate/VideoPlayer/VideoPlayerModule';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';

import NFTfavicon from './../images/favicons/NFT_favicon.ico';

import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './../SplashPageTemplate/AuthorCard/AuthorCard.css';

//TODO:Until we have a contract it will be commented
// import { TNftFilesResponse } from '../../axios.responseTypes';
// import axios from 'axios';

// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const NFTLASplashPage: React.FC<ISplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  // TODO: Until we have a contract it will be commented
  const [allVideos /*setAllVideos*/] = useState<TFileType[]>([]);
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  window.addEventListener('resize', () => setCarousel(carousel_match.matches));
  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);
  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

  const whatSplashPage = 'nftla-page';

  const someAdditionalData: TVideoPlayerViewSpecialVideoType[] = [
    {
      urlVideo: 'https://storage.googleapis.com/rair-videos/',
      mediaIdVideo: 'YOyAaCOt8xrOt-NcvffXR7g0ibX5kJ2w21yGHR1XKOPMEY',
      videoTime: '02:21.38',
      videoName: 'NFTs and Hollywood',
      VideoBg: NFTLA1
    },
    {
      urlVideo: 'https://storage.googleapis.com/rair-videos/',
      mediaIdVideo: 'Zosxmne0LRAu2TxEMU5A0WMg8-msfHqvxGws9osGnu4yxL',
      videoTime: '32:00.58',
      videoName: 'Orange Comet',
      VideoBg: NFTLA2
    },
    {
      urlVideo: 'https://storage.googleapis.com/rair-videos/',
      mediaIdVideo: 'pZJJmq9rR6HC1jPxy-RpVvutfTYMtyAGRb2DDnMdTTIlhA',
      videoTime: '30:46.31',
      videoName: 'Web 3 Convergence',
      VideoBg: NFTLA3
    }
  ];

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: 'Official NFTLA Streaming NFTs',
        ogTitle: 'Official NFTLA Streaming NFTs',
        twitterTitle: 'Official NFTLA Streaming NFTs',
        contentName: 'author',
        content: '#NFTLA',
        description:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        ogDescription:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        twitterDescription:
          'Claim your NFT to unlock encrypted streams from the NFTLA conference',
        image:
          'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW',
        favicon: NFTfavicon,
        faviconMobile: NFTfavicon
      })
    );
    //eslint-disable-next-line
  }, []);

  //temporarily unused-snippet
  // const getAllVideos = useCallback(async () => {
  //   const response = await axios.get<TNftFilesResponse>(
  //     '/api/nft/network/neededBlockchain/neededContract/indexInContract/files'
  //   );
  //   setAllVideos(response.data.files);
  //   setSelectVideo(response.data.files[0]);
  // }, []);

  // useEffect(() => {
  //   getAllVideos();
  // }, [getAllVideos]);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page">
      <MetaTags seoMetaTags={seo} />
      <div className="template-home-splash-page">
        <AuthorCard splashData={splashData} />
        <ListExlusiveProduct
          carousel={!carousel}
          carouselTitle={splashData.carouselTitle}
          carouselData={splashData.carouselData}
        />
        <VideoPlayerModule
          backgroundImage={splashData.backgroundImage}
          videoData={splashData.videoData}
        />
        <SplashVideoWrapper>
          <SplashVideoTextBlock>
            <div className="title-gets">
              <h3> NFTLA </h3>
            </div>
            <SplashCardButton
              className="need-help-kohler"
              buttonAction={handleReactSwal}
              buttonLabel={'Need Help'}
            />
          </SplashVideoTextBlock>
          <UnlockableVideosWrapper
            selectVideo={selectVideo}
            setSelectVideo={setSelectVideo}
            productsFromOffer={productsFromOffer}
            openVideoplayer={openVideoplayer}
            setOpenVideoPlayer={setOpenVideoPlayer}
            handlePlayerClick={handlePlayerClick}
            primaryColor={primaryColor}
          />
        </SplashVideoWrapper>
        <TeamMeet
          arraySplash={'NFTLA'}
          titleHeadFirst={'About'}
          teamArray={teamNFTLAarray}
        />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default NFTLASplashPage;
