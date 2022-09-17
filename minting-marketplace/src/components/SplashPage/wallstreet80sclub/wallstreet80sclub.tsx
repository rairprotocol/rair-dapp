import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './wallstreet80sclub.css';

import WallstreetImg from '../images/wallstreet.png';
import MetaMaskIcon from '../images/metamask_logo.png';
import WallstreetCounter from '../images/wallstreetCounter.png';
import WallstreetA from '../images/wallstreetA.png';
import WallstreetB from '../images/wallstreetB.png';
import WallstreetC from '../images/wallstreetC.png';
import WallstreetD from '../images/wallstreetD.png';
import WallstreetE from '../images/wallstreetE.png';
import WallstreetF from '../images/wallstreetF.png';

/* importing Components*/
import TokenLeftTemplate from '../TokenLeft/TokenLeftTemplate';
import CarouselModule from '../SplashPageTemplate/Carousel/Carousel';
import PurchaseTokenButton from '../../common/PurchaseToken';
import TeamMeet from '../TeamMeet/TeamMeetList';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import { setRealChain } from '../../../ducks/contracts/actions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';

import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import ButtonHelp from '../PurchaseChecklist/ButtonHelp';
import DiscordIcon from '../images/discord-icon.png';
import {
  ISplashPageProps,
  TMainContractType,
  TSplashDataType
} from '../splashPage.types';
import { rFetch } from '../../../utils/rFetch';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { useGetProducts } from '../splashPageProductsHook';
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
  seoInformation: {
    title: '#wallstreet80sclub',
    contentName: 'author',
    content: '#wallstreet80sclub',
    description: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW'
    // favicon: null,
    // image: null
  },
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
    img: MetaMaskIcon,
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
    buttonImg: DiscordIcon,
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
  const dispatch = useDispatch();

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
      <MetaTags seoMetaTags={splashData.seoInformation} />
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
        <h1 className="splashpage-subtitle above-meet-team">
          {' '}
          Founding Members{' '}
        </h1>
        <TeamMeet arraySplash={'wallstreet80sclub'} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.LicenseName}
        />
      </div>
    </div>
  );
};

export default Wallstreet80sClubSplashPage;
