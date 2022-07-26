//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './UkraineSplash.css';

/* importing images*/
import UKR_rounded from '../images/UkraineGlitchNFTExamples/rounded_corners.png';
import UKR4 from '../images/UkraineGlitchNFTExamples/4.jpg';
import UKR5 from '../images/UkraineGlitchNFTExamples/5.gif';
import UKR126 from '../images/UkraineGlitchNFTExamples/126.jpg';
// import UKR246 from '../images/UkraineGlitchNFTExamples/246.jpg'
import UKR497 from '../images/UkraineGlitchNFTExamples/497.jpg';
// import UKR653 from '../images/UkraineGlitchNFTExamples/653.jpg'
// import UKR777 from '../images/UkraineGlitchNFTExamples/777.jpg'
// import UKR1050 from '../images/UkraineGlitchNFTExamples/1050.jpg'
import UKR1294 from '../images/UkraineGlitchNFTExamples/1294.jpg';
// import UKR1518 from '../images/UkraineGlitchNFTExamples/1518.jpg'
// import UKR1641 from '../images/UkraineGlitchNFTExamples/1641.jpg'
// import UKR1896 from '../images/UkraineGlitchNFTExamples/1896.jpg'
import UKR1989 from '../images/UkraineGlitchNFTExamples/1989.jpg';
import videoBackground from '../images/metamask-vid-final.png';
import nftCountUkraine from '../images/UkrainianSoldierswithMedical/nftCountUkraine.jpeg';
import faviconUkraine from './../images/favicons/favicon-ukraine.ico';

// import NFTLA_Video from "../images/NFT-LA-RAIR-2021.mp4"
import MetaMaskIcon from '../images/metamask_logo.png';
import DiscordIcon from '../images/discord-icon.png';

/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
// import setTitle from "../../../utils/setTitle";
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import CarouselModule from '../SplashPageTemplate/Carousel/Carousel';
import VideoPlayerModule from '../SplashPageTemplate/VideoPlayer/VideoPlayerModule';
// import StaticTiles from "../SplashPageTemplate/VideoTiles/StaticTiles";
// import UnlockableVideo from "../images/nipsey1.png";
// import NFTCounter from "../SplashPageTemplate/NFTCounter/NFTCounter";
import NFTImages from '../SplashPageTemplate/NFTImages/NFTImages';
import TokenLeftTemplate from '../TokenLeft/TokenLeftTemplate';

import PurchaseTokenButton from '../../common/PurchaseToken';
import Swal from 'sweetalert2';
import MetaTags from './../../SeoTags/MetaTags';
import { rFetch } from '../../../utils/rFetch';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import { setRealChain } from '../../../ducks/contracts/actions';
// import PurchaseChecklist from "../PurchaseChecklist/PurchaseChecklist";

// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

// This will be the default contract used in this splash page
const mainContract = {
  contractAddress: '0xbd034e188f35d920cf5dedfb66f24dcdd90d7804',
  requiredBlockchain: '0x1',
  offerIndex: [0, 1]
};
// By setting REACT_APP_TEST_CONTRACTS
const testContract = {
  contractAddress: '0x971ee6dd633cb6d8cc18e5d27000b7dde30d8009',
  requiredBlockchain: '0x5',
  offerIndex: [52, 0]
};

const splashData = {
  title: '#UkraineGlitch',
  titleColor: '#FFD505',
  description: [
    '1991 generative pixelated glitch art pieces represent pseudo random shelling, aimless fire, a flag in distress ',
    <br key={Math.random() * 1_000_000} />,
    <br key={Math.random() * 1_000_000} />,
    '100% of proceeds fund tactical first aid supplies and Ukrainian developers'
  ],
  seoInformation: {
    title: 'Слава Україні!',
    contentName: 'author',
    content: '#UkraineGlitch',
    description: '1991 Generative Abstract Glitch Art pieces to aid Ukraine',
    favicon: faviconUkraine,
    image: UKR_rounded
  },
  buttonLabel: 'Mint for .1991 Eth',
  buttonBackgroundHelp: 'rgb(3, 91, 188)',
  backgroundImage: UKR_rounded,
  purchaseButton: {
    // Reusable component
    buttonComponent: PurchaseTokenButton,
    // OPTIONAL: Image on the purchase button
    img: MetaMaskIcon,
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
    customSuccessAction: async (nextToken) => {
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
    buttonImg: DiscordIcon,
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

const UkraineSplashPage = ({ loginDone, connectUserData, setIsSplashPage }) => {
  const [openCheckList, setOpenCheckList] = useState(false);
  const [soldCopies, setSoldCopies] = useState(0);
  const { primaryColor } = useSelector((store) => store.colorStore);
  const { currentChain, minterInstance } = useSelector(
    (store) => store.contractStore
  );
  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [purchaseList, setPurshaseList] = useState(true);
  const ukraineglitchChainId = '0x1';
  const dispatch = useDispatch();

  const togglePurchaseList = () => {
    setPurshaseList((prev) => !prev);
  };

  const toggleCheckList = () => {
    setOpenCheckList((prev) => !prev);
  };

  window.addEventListener('resize', () => setCarousel(carousel_match.matches));

  const getAllProduct = useCallback(async () => {
    if (loginDone) {
      if (currentChain === splashData.purchaseButton.requiredBlockchain) {
        setSoldCopies(
          (
            await minterInstance.getOfferRangeInfo(
              ...splashData.purchaseButton.offerIndex
            )
          ).tokensAllowed.toString()
        );
      } else {
        setSoldCopies();
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
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page ukraineglitch">
      <MetaTags seoMetaTags={splashData.seoInformation} />
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
          copies={splashData.counterData.nftCount}
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
          amountTokens={splashData.counterData.nftCount}
          titleNft={splashData.exclusiveNft.title}
          colorText={splashData.exclusiveNft.titleColor}
          carousel={carousel}
        />
        {/* <div style={{ height: "108px" }} /> */}
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
        <TeamMeet primaryColor={primaryColor} arraySplash={'ukraine'} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default UkraineSplashPage;
