import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { teamWallstreetArray } from './AboutUsTeam';

import RairFavicon from '../../../components/MockUpPage/assets/rair_favicon.ico';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import { discrodIconNoBorder, metaMaskIcon } from '../../../images';
import { rFetch } from '../../../utils/rFetch';
import PurchaseTokenButton from '../../common/PurchaseToken';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import MetaTags from '../../SeoTags/MetaTags';
import {
  WallstreetA,
  WallstreetB,
  WallstreetC,
  WallstreetCounter,
  WallstreetD,
  WallstreetE,
  WallstreetF,
  WallstreetImg
} from '../images/wallstreet80sclub/wallstreet80sclub';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import ButtonHelp from '../PurchaseChecklist/ButtonHelp';
import {
  ISplashPageProps,
  TMainContractType,
  TSplashDataType
} from '../splashPage.types';
import { useGetProducts } from '../splashPageProductsHook';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import CarouselModule from '../SplashPageTemplate/Carousel/Carousel';
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
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

//unused-snippet
const reactSwal = withReactContent(Swal);

// default contract
const mainContract: TMainContractType = {
  contractAddress: '0xbd034e188f35d920cf5dedfb66f24dcdd90d7804',
  requiredBlockchain: '0x1',
  offerIndex: ['0', '1']
};
// test contract
const testContract: TMainContractType = {
  contractAddress: '0x971ee6dd633cb6d8cc18e5d27000b7dde30d8009',
  requiredBlockchain: '0x5',
  offerIndex: ['52', '0']
};

const contract =
  process.env.REACT_APP_TEST_CONTRACTS === 'true'
    ? testContract.contractAddress
    : mainContract.contractAddress;
const blockchain =
  process.env.REACT_APP_TEST_CONTRACTS === 'true'
    ? testContract.requiredBlockchain
    : mainContract.requiredBlockchain;

const splashData: TSplashDataType = {
  LicenseName: '#wallstreet80sclub',
  title: 'wallstreet80sclub',
  titleColor: '#000000',
  description: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
  carouselData: [
    {
      img: WallstreetA,
      description: 'SILIAN RAIL'
    },
    {
      img: WallstreetB,
      description: 'ROMAN TYPE'
    },
    {
      img: WallstreetC,
      description: 'GUERILAN SEMIBOLD'
    },
    {
      img: WallstreetD,
      description: 'AREAOL ROUND'
    },
    {
      img: WallstreetE,
      description: 'TASTEFUL THICKNESS'
    },
    {
      img: WallstreetF,
      description: 'RAISED LETTERING'
    }
  ],
  videoPlayerParams: {
    contract: contract,
    product: '0',
    blockchain: blockchain
  },
  buttonBackgroundHelp: 'rgb(90,27,3)',
  buttonBackgroundHelpText: 'NEED HELP',
  buttonLabel: 'freemint',
  customStyle: {
    background: 'rgb(89,25,8)'
  },
  backgroundImage: WallstreetImg,
  purchaseButton: {
    buttonComponent: PurchaseTokenButton,
    img: metaMaskIcon,
    ...(process.env.REACT_APP_TEST_CONTRACTS === 'true'
      ? testContract
      : mainContract),
    presaleMessage: '',
    customWrapperClassName: 'btn-submit-with-form',
    blockchainOnly: true,
    customSuccessAction: async (nextToken) => {
      const tokenMetadata = await rFetch(
        `/api/nft/network/${blockchain}/${contract}/0/token/${nextToken}`
      );
      if (tokenMetadata.success && tokenMetadata?.result?.metadata?.image) {
        Swal.fire({
          imageUrl: tokenMetadata.result.metadata.image,
          imageHeight: 'auto',
          imageWidth: '65%',
          imageAlt: "Your NFT's image",
          title: `You own #${nextToken}!`,
          icon: 'success'
        });
      } else {
        Swal.fire('Success', `Bought token #${nextToken}`, 'success');
      }
    }
  },
  button2: {
    buttonTextColor: '#FFFFFF',
    buttonColor: '#000000',
    buttonLabel: 'Join our Discord',
    buttonImg: discrodIconNoBorder,
    buttonLink: 'https://discord.com/invite/y98EMXRsCE'
  },
  counterOverride: true,
  counterData: {
    titleColor: '#000000',
    title1: null,
    title2: 'YOUR TICKET TO THE BOARDROOM',
    backgroundImage: `url(${WallstreetCounter})`,
    btnColorIPFS: 'rgb(89,25,8)',
    nftCount: 1987,
    description: [
      `WE'RE BUYING`,
      '+ LUNCH WITH WARREN BUFFETT',
      '+ DOWNTOWN MANHATTAN LOFT SPACE',
      '+ TWO TICKETS TO PARADISE IN A RED TESTAROSSA',
      '\n',
      'SHARING EXCLUSIVE ALPHA',
      '+ STONKS',
      '+ CRYPTO',
      '+ PROTIPS'
    ]
  }
};

const Wallstreet80sClubSplashPage: React.FC<ISplashPageProps> = ({
  loginDone,
  connectUserData,
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  /* UTILITIES FOR VIDEO PLAYER VIEW (placed this functionality into custom hook for reusability)*/
  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);

  /* UTILITIES FOR CAROUSEL */
  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState<boolean>(carousel_match.matches);

  /* UTILITIES FOR NFT PURCHASE */
  const [soldCopies, setSoldCopies] = useState<number>(0);
  const { currentChain, minterInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);

  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: '#wallstreet80sclub',
        ogTitle: '#wallstreet80sclub',
        twitterTitle: '#wallstreet80sclub',
        contentName: 'author',
        content: '#wallstreet80sclub',
        description: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
        ogDescription: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
        twitterDescription: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
        image:
          'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW',
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
    dispatch(setRealChain(blockchain));
    //eslint-disable-next-line
  }, []);

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };
  const toggleCheckList = () => {
    setOpenCheckList((prev) => !prev);
  };
  const getAllProduct = useCallback(async () => {
    if (loginDone) {
      if (currentChain === splashData.purchaseButton?.requiredBlockchain) {
        setSoldCopies(
          (
            await minterInstance?.getOfferRangeInfo(
              ...(splashData.purchaseButton?.offerIndex || [])
            )
          ).tokensAllowed.toString()
        );
      } else {
        setSoldCopies(0);
      }
    }
  }, [setSoldCopies, loginDone, currentChain, minterInstance]);

  useEffect(() => {
    getAllProduct();
  }, [getAllProduct]);

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
        <AuthorCard {...{ splashData, connectUserData }} />
        <TokenLeftTemplate
          counterData={splashData.counterData}
          soldCopies={soldCopies}
          primaryColor={primaryColor}
          loginDone={loginDone}
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
        <CarouselModule
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
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.LicenseName}
        />
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
