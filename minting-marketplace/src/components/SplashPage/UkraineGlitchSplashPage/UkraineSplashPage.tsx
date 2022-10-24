import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { teamUkraineArray } from './AboutUsTeam';

import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
// import NFTLA_Video from "../images/NFT-LA-RAIR-2021.mp4"
import { discrodIconNoBorder, metaMaskIcon } from '../../../images';
import { rFetch } from '../../../utils/rFetch';
import PurchaseTokenButton from '../../common/PurchaseToken';
/* importing images*/
import {
  nftCountUkraine,
  UKR_rounded,
  UKR4,
  UKR5,
  UKR126,
  UKR497,
  UKR1294,
  UKR1989,
  videoBackground
} from '../images/UkraineGlitch/urkaineGlitch';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import {
  ISplashPageProps,
  TMainContractType,
  TSplashDataType
} from '../splashPage.types';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import CarouselModule from '../SplashPageTemplate/Carousel/Carousel';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
// import StaticTiles from "../SplashPageTemplate/VideoTiles/StaticTiles";
// import UnlockableVideo from "../images/nipsey1.png";
// import NFTCounter from "../SplashPageTemplate/NFTCounter/NFTCounter";
import NFTImages from '../SplashPageTemplate/NFTImages/NFTImages';
import VideoPlayerModule from '../SplashPageTemplate/VideoPlayer/VideoPlayerModule';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import TokenLeftTemplate from '../TokenLeft/TokenLeftTemplate';

import MetaTags from './../../SeoTags/MetaTags';
import faviconUkraine from './../images/favicons/favicon-ukraine.ico';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './UkraineSplash.css';
// import PurchaseChecklist from "../PurchaseChecklist/PurchaseChecklist";

// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

// This will be the default contract used in this splash page
const mainContract: TMainContractType = {
  contractAddress: '0xbd034e188f35d920cf5dedfb66f24dcdd90d7804',
  requiredBlockchain: '0x1',
  offerIndex: ['0', '1']
};
// By setting REACT_APP_TEST_CONTRACTS
const testContract: TMainContractType = {
  contractAddress: '0x971ee6dd633cb6d8cc18e5d27000b7dde30d8009',
  requiredBlockchain: '0x5',
  offerIndex: ['52', '0']
};

const splashData: TSplashDataType = {
  title: '#UkraineGlitch',
  titleColor: '#FFD505',
  description:
    '1991 generative pixelated glitch art pieces represent pseudo random shelling, aimless fire, a flag in distress 100% of proceeds fund tactical first aid supplies and Ukrainian developers',
  buttonLabel: 'Mint for .1991 Eth',
  buttonBackgroundHelp: 'rgb(3, 91, 188)',
  backgroundImage: UKR_rounded,
  purchaseButton: {
    // Reusable component
    buttonComponent: PurchaseTokenButton,
    // OPTIONAL: Image on the purchase button
    img: metaMaskIcon,
    // Contract address
    ...(process.env.REACT_APP_TEST_CONTRACTS === 'true'
      ? testContract
      : mainContract),
    // Custom style for the button
    customStyle: {
      backgroundColor: '#035BBC'
    },
    presaleMessage:
      'By accepting these terms, I agree to glitch the flag and support the country in distress.',
    // Custom class for the div surrounding the button
    customWrapperClassName: 'btn-submit-with-form',
    blockchainOnly: true,
    // Custom function that will be called if the minting is a success
    // First parameter will be the minted token's number
    customSuccessAction: async (nextToken: number) => {
      const tokenMetadata = await rFetch(
        `/api/nft/network/0x1/0xbd034e188f35d920cf5dedfb66f24dcdd90d7804/0/token/${nextToken}`
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

  // button1: {
  //   buttonColor: "#035BBC",
  //   buttonLabel: "Mint for .1 ETH",
  //   buttonImg: MetaMaskIcon,
  //   buttonLink: "https://placekitten.com/200/300",
  // },

  button2: {
    buttonColor: '#FFD505',
    buttonLabel: 'Join Our Discord',
    buttonImg: discrodIconNoBorder,
    buttonLink: 'https://discord.com/invite/y98EMXRsCE'
  },
  exclusiveNft: {
    title: 'NFTs',
    titleColor: 'rgb(3, 91, 188)'
  },
  carouselTitle: 'Our Developers',
  carouselData: [
    {
      title: 'Alex & Arsenii',
      img: UKR126,
      description:
        'Originally based in Kharkiv, Alex and Arsenii are experienced frontend REACT developers that created the site you see here'
    },
    {
      title: 'Masha',
      img: UKR497,
      description:
        'Born in Odessa, Masha emigrated with her family to the US when she was a small child. They remained closely connected to the Post-Soviet immigrant community of the Pacific NW while growing up. She created these pieces of glitch art as a way to process the grief of a country in dispair, and to continue funding the shipment of medical supplies to the war-torn area.'
    },
    {
      title: 'Valerii & Natalia',
      img: UKR1294,
      description:
        'Originally based in Kharkiv, Valerii and Natalia are respsonsible for backend database architecture and syncing to allow for seemless purchase'
    }
  ],
  videoData: {
    video: null,
    videoTitle: 'Watch the Transformation',
    videoModuleDescription: 'Flag owners sign in with metamask to watch',
    videoModuleTitle: 'For Supporters Only',
    baseURL: 'https://storage.googleapis.com/rair-videos/',
    mediaId: 'VUPLZvYEertdAQMiZ4KTI9HgnX5fNSN036GAbKnj9XoXbJ'
  },
  tilesTitle: null,
  NFTName: '#ukraineglitch',
  counterData: {
    titleColor: '#FFD505',
    title1: '#ukraineglitch',
    title2: 'origins',
    backgroundImage: `url(${nftCountUkraine})`,
    btnColorIPFS: '#035BBC',
    nftCount: 1991,
    royaltiesNft: {
      firstBlock: [
        'Ukrainian Dev Fund: 42%',
        'Medical Supplies: 42%',
        'RAIR Node Fee: 10%',
        'Contract Gas Fund: 6%'
      ],
      secondBlock: [
        '1 UkraineGlitch Flag Supports',
        '- weeks of lodging for 1 Ukrainian',
        '- 10 Tourniquets sent to those in need'
      ]
    },
    properties: [
      {
        titleProperty: 'Fermion Freckles',
        titleColor: '#FFD505',
        propertyDesc: '14',
        percent: '32%'
      },
      {
        titleProperty: 'Boson Movement',
        titleColor: '#035BBC',
        propertyDesc: 'Sparklink / Still',
        percent: '1.7%'
      }
    ],
    description: [
      'This (de)generative art project was created to provide 100% direct aid to Ukraine.',
      '2014',
      'Ukrainian immigrants in the Pacific Northwest of the United States had taken it into their own hands to provide a direct supply chain of specialty tactical medical equipment to Ukraine’s grassroots militias. We are here to continue their story.',
      '2022',
      'This website was built by Ukrainian Web3 developers. The logic of the algorithm written by a Ukranian generative artist. Prior to the war they were making NFTs for fun, now for a purpose.',
      'About the piece',
      'The algorithm is set such that as the number of the NFT increases, the chaotic opposite square masses also increase, eventually inverting or turning the flag upside-down. Some NFTs are animated (sparkling) to show parts of this progression, and others are still. Only holders of a UkraineGlitch NFT can watch the full animation of the flag transformation occur below.'
    ]
  }
};

const UkraineSplashPage: React.FC<ISplashPageProps> = ({
  loginDone,
  connectUserData,
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [soldCopies, setSoldCopies] = useState<number>(0);
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const { currentChain, minterInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [purchaseList, setPurshaseList] = useState(true);
  const ukraineglitchChainId = '0x1';

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: 'Слава Україні!',
        ogTitle: 'Слава Україні!',
        twitterTitle: 'Слава Україні!',
        contentName: 'author',
        content: '#UkraineGlitch',
        description:
          '1991 Generative Abstract Glitch Art pieces to aid Ukraine',
        ogDescription:
          '1991 Generative Abstract Glitch Art pieces to aid Ukraine',
        twitterDescription:
          '1991 Generative Abstract Glitch Art pieces to aid Ukraine',
        image: UKR_rounded,
        favicon: faviconUkraine,
        faviconMobile: faviconUkraine
      })
    );
    //eslint-disable-next-line
  }, []);

  const togglePurchaseList = () => {
    setPurshaseList((prev) => !prev);
  };

  const toggleCheckList = () => {
    setOpenCheckList((prev) => !prev);
  };

  window.addEventListener('resize', () => setCarousel(carousel_match.matches));

  const getAllProduct = useCallback(async () => {
    if (loginDone) {
      if (
        currentChain === splashData.purchaseButton?.requiredBlockchain &&
        splashData.purchaseButton?.offerIndex
      ) {
        setSoldCopies(
          (
            await minterInstance?.getOfferRangeInfo(
              ...splashData.purchaseButton?.offerIndex
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

  useEffect(() => {
    dispatch(setRealChain(ukraineglitchChainId));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page ukraineglitch">
      <MetaTags seoMetaTags={seo} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          toggleCheckList={toggleCheckList}
          backgroundColor={{
            darkTheme: 'rgb(3, 91, 188)',
            lightTheme: 'rgb(3, 91, 188)'
          }}
        />
        <AuthorCard {...{ splashData, connectUserData, toggleCheckList }} />
        {/* <PurchaseChecklist
          toggleCheckList={toggleCheckList}
          openCheckList={openCheckList}
          nameSplash={"UkraineGlitch"}
          backgroundColor={{ darkTheme: "rgb(3, 91, 188)", lightTheme: "rgb(3, 91, 188)" }}
        /> */}
        {/* <NFTCounter primaryColor={"rhyno"} leftTokensNumber={0} wholeTokens={0} counterData={splashData.counterData} /> */}
        <TokenLeftTemplate
          counterData={splashData.counterData}
          soldCopies={soldCopies}
          primaryColor={primaryColor}
          loginDone={loginDone}
          nftTitle="NFTs Left"
        />
        <NFTImages
          NftImage={UKR5}
          Nft_1={UKR497}
          Nft_2={UKR1989}
          Nft_3={UKR4}
          Nft_4={UKR126}
          amountTokens={splashData.counterData?.nftCount}
          titleNft={splashData.exclusiveNft?.title}
          colorText={splashData.exclusiveNft?.titleColor}
          carousel={carousel}
        />
        <VideoPlayerModule
          backgroundImage={videoBackground}
          videoData={splashData.videoData}
        />
        {/* <StaticTiles title={splashData.tilesTitle} primaryColor={primaryColor} UnlockableVideo={UnlockableVideo}/> */}
        <CarouselModule
          carousel={!carousel}
          carouselTitle={splashData.carouselTitle}
          carouselData={splashData.carouselData}
        />
        <TeamMeet
          arraySplash={'ukraine'}
          titleHeadFirst={'About the'}
          titleHeadSecond={'Cause'}
          colorHeadSecond={'#035BBC'}
          teamArray={teamUkraineArray}
        />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default UkraineSplashPage;
