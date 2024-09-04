import { FC, useEffect, useState } from 'react';

import { teamWallstreetArray } from './AboutUsTeam';

import RairFavicon from '../../../components/MockUpPage/assets/rair_favicon.ico';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import { setSEOInfo } from '../../../redux/seoSlice';
import { setRequestedChain } from '../../../redux/web3Slice';
import { SplashPageProps } from '../../../types/commonTypes';
import {
  blockchain,
  splashData
} from '../../../utils/infoSplashData/wallStreet80Club';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import ButtonHelp from '../PurchaseChecklist/ButtonHelp';
import { useGetProducts } from '../splashPageProductsHook';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import ListExlusiveProduct from '../SplashPageTemplate/ListExlusiveProduct/ListExlusiveProduct';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import TeamMeet from '../TeamMeet/TeamMeetList';
/* importing Components*/
import TokenLeftTemplate from '../TokenLeft/TokenLeftTemplate';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './wallstreet80sclub.css';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './wallstreet80sclub.css';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './wallstreet80sclub.css';
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const Wallstreet80sClubSplashPage: FC<SplashPageProps> = ({
  setIsSplashPage
}) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);
  /* UTILITIES FOR VIDEO PLAYER VIEW (placed this functionality into custom hook for reusability)*/
  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);

  /* UTILITIES FOR CAROUSEL */
  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState<boolean>(carousel_match.matches);

  /* UTILITIES FOR NFT PURCHASE */
  const [soldCopies] = useState<number>(0);
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);

  const { primaryColor } = useAppSelector((store) => store.colors);

  useEffect(() => {
    dispatch(
      setSEOInfo({
        title: '#wallstreet80sclub',
        ogTitle: '#wallstreet80sclub',
        twitterTitle: '#wallstreet80sclub',
        contentName: 'author',
        content: '#wallstreet80sclub',
        description: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
        ogDescription: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
        twitterDescription: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
        image: `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
        favicon: RairFavicon,
        faviconMobile: RairFavicon
      })
    );
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);
  // const whatSplashPage = 'genesis-font';

  useEffect(() => {
    window.addEventListener('resize', () =>
      setCarousel(carousel_match.matches)
    );
    return () =>
      window.removeEventListener('resize', () =>
        setCarousel(carousel_match.matches)
      );
  }, [carousel_match.matches]);

  useEffect(() => {
    dispatch(setRequestedChain(blockchain));
    //eslint-disable-next-line
  }, []);

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };
  const toggleCheckList = () => {
    setOpenCheckList((prev) => !prev);
  };

  return (
    <div className="wrapper-splash-page wallstreet80sclub">
      <MetaTags seoMetaTags={seo} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          toggleCheckList={toggleCheckList}
          templateOverride={true}
          backgroundColor={{
            darkTheme: 'rgb(3, 91, 188)',
            lightTheme: 'rgb(3, 91, 188)'
          }}
        />
        <AuthorCard {...{ splashData }} />
        <TokenLeftTemplate
          counterData={splashData.counterData}
          soldCopies={soldCopies}
          counterOverride={true}
          nftTitle="NFTs Left"
        />
        <div className="btn-submit-with-form need-help">
          <ButtonHelp
            toggleCheckList={toggleCheckList}
            backgroundButton={splashData.buttonBackgroundHelp}
            backgroundButtonText={splashData.buttonBackgroundHelpText}
          />
        </div>
        <h1 className="splashpage-subtitle below-need-help">
          <div>Members only Alpha</div>
        </h1>
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          primaryColor={primaryColor}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
        />
        <h1 className="splashpage-subtitle">
          <div> Styles for Every Executive</div>
        </h1>
        <ListExlusiveProduct
          carousel={!carousel}
          carouselTitle={splashData.carouselTitle}
          carouselData={splashData.carouselData}
        />
        <TeamMeet
          classNameHead="splashpage-subtitle above-meet-team"
          arraySplash={'wallstreet80sclub'}
          titleHeadFirst="Founding Members"
          teamArray={teamWallstreetArray}
        />
        <NotCommercialTemplate NFTName={splashData.LicenseName} />
      </div>
    </div>
  );
};

export default Wallstreet80sClubSplashPage;

//will be used later
{
  /* <ThemeProvider theme={theme}>
  <StyledSplashPageWrapperContainer>
    <SplashPageMainBlock
      bgColor="#FFFFFF"
      heightDiff="694px"
      borderRadius="24px">
      <MainBlockInfoText padding={'190px 20px 0px 75px'}>
        <MainTitleBlock
          color="#000000"
          fontSize="50px"
          fontWeight={700}
          text={splashData.title}
          fontFamily={"'Cooper Std Black', sans-serif"}
          lineHeight={'1.2'}
        />
        <MainTitleBlock
          color="rgb(89, 25, 8)"
          fontSize="30px"
          fontWeight={'normal'}
          text={splashData.description}
          fontFamily={"'Copperplate', sans-serif"}
          lineHeight={'33px'}
          margin={'27px 0 0'}
          padding={'0 0 0 7px'}
          width="476px"
        />
        <ButtonContainerMainBlock
          margin={'82px 0px 0px 0px'}
          height="148px"
          width="335px"
          flexDirection="column">
          <PurchaseTokenButton
            {...splashData.purchaseButton}
            isSplashPage={isSplashPage}
            buttonData={splashData.button1}
            diamond={false}
          />
          <ButtonMainBlock
            width={'100%'}
            height="64px"
            buttonData={splashData.button2}
            fontFamily={"'Cooper Std Black', sans-serif"}
            fontWeight={'400'}
            lineHeight={'22px'}
            fontSize={'20px'}
            buttonLogoMarginRight="23px"
          />
        </ButtonContainerMainBlock>
      </MainBlockInfoText>
      <ImageMainBlock
        image={splashData.backgroundImage}
        widthDiff="491px"
        heightDiff="491px"
        imageMargin={'0px 77px 97px 0px'}
      />
    </SplashPageMainBlock>
  </StyledSplashPageWrapperContainer>
</ThemeProvider>; */
}
