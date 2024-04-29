//@ts-nocheck
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { teamNFTLAarray } from './AboutUsTeam';
import { ISplashPageProps } from './splashPage.types';

import { RootState } from '../../../ducks';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import useSwal from '../../../hooks/useSwal';
import { splashData } from '../../../utils/infoSplashData/nftla';
import MetaTags from '../../SeoTags/MetaTags';
/* importing images*/
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
  const primaryColor = useSelector<RootState, string>(
    (store) => store.colorStore.primaryColor
  );
  const reactSwal = useSwal();
  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  window.addEventListener('resize', () => setCarousel(carousel_match.matches));
  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);
  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

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
        image: `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
        favicon: NFTfavicon,
        faviconMobile: NFTfavicon
      })
    );
    //eslint-disable-next-line
  }, []);

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
              buttonAction={handleReactSwal(reactSwal)}
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
