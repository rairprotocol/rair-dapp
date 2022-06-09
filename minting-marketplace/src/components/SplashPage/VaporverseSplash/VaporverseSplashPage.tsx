//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../SplashPageTemplate/AuthorCard/AuthorCard.css";
import "../../AboutPage/AboutPageNew/AboutPageNew.css";
import "./VaporverseSplash.css";

/* importing images*/
import vaporverse_background from '../images/vaporverse_authorcard_background.png';
import VV0 from '../images/vv_NFT_0.png';
import VV1 from '../images/vv_NFT_1.png';
import VV2 from '../images/vv_NFT_2.png';
import VV3 from '../images/vv_NFT_3.png';
import VV4 from '../images/vv_NFT_4.png';

import VV_warning_1 from '../images/vv_warning_1.png';
import VV_warning_2 from '../images/vv_warning_2.png';
import VV_test_transmission from '../images/vv_test_transmission.png';
import favion_Vaporverse from './../images/favicons/vv_Rair_logo.ico';


import UKR126 from '../images/UkraineGlitchNFTExamples/126.jpg'
// import UKR246 from '../images/UkraineGlitchNFTExamples/246.jpg'
import UKR497 from '../images/UkraineGlitchNFTExamples/497.jpg'
// import UKR653 from '../images/UkraineGlitchNFTExamples/653.jpg'
// import UKR777 from '../images/UkraineGlitchNFTExamples/777.jpg'
// import UKR1050 from '../images/UkraineGlitchNFTExamples/1050.jpg'
import UKR1294 from '../images/UkraineGlitchNFTExamples/1294.jpg'
// import UKR1518 from '../images/UkraineGlitchNFTExamples/1518.jpg'
// import UKR1641 from '../images/UkraineGlitchNFTExamples/1641.jpg'
// import UKR1896 from '../images/UkraineGlitchNFTExamples/1896.jpg'
import videoBackground from '../images/vaporverse_video_background.png';
import nftCountUkraine from '../images/UkrainianSoldierswithMedical/nftCountUkraine.jpeg';
import faviconUkraine from './../images/favicons/favicon-ukraine.ico'


// import NFTLA_Video from "../images/NFT-LA-RAIR-2021.mp4"
import MetaMaskIcon from "../images/metamask_logo.png"
import DiscordIcon from '../images/discord-icon.png';


/* importing Components*/
import TeamMeet from "../TeamMeet/TeamMeetList";
import AuthorCard from "../SplashPageTemplate/AuthorCard/AuthorCard";
import setTitle from "../../../utils/setTitle";
import NotCommercialTemplate from "../NotCommercial/NotCommercialTemplate";
import CarouselModule from "../SplashPageTemplate/Carousel/Carousel";
import VideoPlayerModule from "../SplashPageTemplate/VideoPlayer/VideoPlayerModule";
// import StaticTiles from "../SplashPageTemplate/VideoTiles/StaticTiles";
// import UnlockableVideo from "../images/nipsey1.png";
// import NFTCounter from "../SplashPageTemplate/NFTCounter/NFTCounter";
import NFTImages from "../SplashPageTemplate/NFTImages/NFTImages";
import TokenLeftTemplate from "../TokenLeft/TokenLeftTemplate";

import PurchaseTokenButton from '../../common/PurchaseToken';
import Swal from 'sweetalert2';
import MetaTags from '../../SeoTags/MetaTags'
import { rFetch } from '../../../utils/rFetch';
import ModalHelp from "../SplashPageTemplate/ModalHelp";
import PurchaseChecklist from "../PurchaseChecklist/PurchaseChecklist";
import { setRealChain } from "../../../ducks/contracts";

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
  title: null,
  titleColor: "rgb(234,51,127)",
  description: null,
  cardFooter: "/utility drop for OG degens /mintpass to vaporverse",
  seoInformation: {
    title: "Vaporverse",
    contentName: "author",
    content: "Vaporverse",
    description: "Utility drop for OG degens /mintpass to vaporverse",
    favicon: favion_Vaporverse,
    image: vaporverse_background
  },
  buttonLabel: "Mint for .1991 Eth",
  buttonBackgroundHelp: null,
  backgroundImage: vaporverse_background,
  purchaseButton: null,
  button1: {
    buttonColor: "rgb(234,51,127)",
    buttonLabel: "premint.xyz",
    buttonImg: null,
    buttonLink: "https://www.premint.xyz/vaporversexyz/",
  },

  button2: {
    buttonColor: "rgb(189,52,183)",
    buttonLabel: "discord",
    buttonImg: null,
    buttonLink: "https://discord.gg/pSTbf2yz7V",
  },

  button3: {
    buttonColor: "rgb(189,52,183)",
    buttonLabel: "twitter",
    buttonImg: null,
    buttonLink: "https://twitter.com/rairtech",
  },

  exclusiveNft: {
    title: "",
    titleColor: "rgb(189,52,183)",
  },
  carouselTitle: "Our Developers",
  carouselData: [
    {
      title: "Alex & Arsenii",
      img: UKR126,
      description:
        "Originally based in Kharkiv, Alex and Arsenii are experienced frontend REACT developers that created the site you see here",
    },
    {
      title: "Masha",
      img: UKR497,
      description:
        "Born in Odessa, Masha emigrated with her family to the US when she was a small child. They remained closely connected to the Post-Soviet immigrant community of the Pacific NW while growing up. She created these pieces of glitch art as a way to process the grief of a country in dispair, and to continue funding the shipment of medical supplies to the war-torn area.",
    },
    {
      title: "Valerii & Natalia",
      img: UKR1294,
      description:
        "Originally based in Kharkiv, Valerii and Natalia are respsonsible for backend database architecture and syncing to allow for seemless purchase",
    },
  ],
  videoData: {
    video: null,
    videoTitle: "Watch the Transformation",
    videoModuleDescription: null,
    videoModuleTitle: "loading... test comms",
    baseURL: 'https://storage.googleapis.com/rair-videos/',
    mediaId: 'VUPLZvYEertdAQMiZ4KTI9HgnX5fNSN036GAbKnj9XoXbJ',
  },
  tilesTitle: null,
  NFTName: "NFT",
  counterData: {
    titleColor: "#FFD505",
    title1: "#ukraineglitch",
    title2: "origins",
    backgroundImage: `url(${nftCountUkraine})`,
    btnColorIPFS: "#035BBC",
    nftCount: 1991,
    royaltiesNft: {
      firstBlock: [
        'Ukrainian Dev Fund: 42%', 'Medical Supplies: 42%', 'RAIR Node Fee: 10%', 'Contract Gas Fund: 6%'
      ],
      secondBlock: [
        '1 UkraineGlitch Flag Supports', '- weeks of lodging for 1 Ukrainian', '- 10 Tourniquets sent to those in need'
      ]
    },
    properties: [
      {
        titleProperty: "Fermion Freckles",
        titleColor: "#FFD505",
        propertyDesc: "14",
        percent: "32%",
      },
      {
        titleProperty: "Boson Movement",
        titleColor: "#035BBC",
        propertyDesc: "Sparklink / Still",
        percent: "1.7%",
      },
    ],
    description: ["This (de)generative art project was created to provide 100% direct aid to Ukraine.", "2014", "Ukrainian immigrants in the Pacific Northwest of the United States had taken it into their own hands to provide a direct supply chain of specialty tactical medical equipment to Ukraine’s grassroots militias. We are here to continue their story.", "2022", "This website was built by Ukrainian Web3 developers. The logic of the algorithm written by a Ukranian generative artist. Prior to the war they were making NFTs for fun, now for a purpose.", "About the piece", "The algorithm is set such that as the number of the NFT increases, the chaotic opposite square masses also increase, eventually inverting or turning the flag upside-down. Some NFTs are animated (sparkling) to show parts of this progression, and others are still. Only holders of a UkraineGlitch NFT can watch the full animation of the flag transformation occur below."]
  }
}


const Text = ({text}) => {return(<>{text}</>)}

const InfoBlock = ({infoArray, style, subclass}) => {
  return (
    <div style={style} className={`info-block ${subclass}`}>
      {infoArray?.map((info, index) => {return (<>{info}<br/></>)})}
    </div>
  )
}

const VaporverseSplashPage = ({ loginDone, connectUserData }) => {
  const [openCheckList, setOpenCheckList] = useState(false);
  const [soldCopies, setSoldCopies] = useState(0);
  const { primaryColor } = useSelector((store) => store.colorStore);
  const { currentChain, minterInstance } = useSelector((store) => store.contractStore);
  const carousel_match = window.matchMedia("(min-width: 630px)");
  const [carousel, setCarousel] = useState(carousel_match.matches);
  const [purchaseList, setPurshaseList] = useState(true);
  const ukraineglitchChainId = '0x1'
  const dispatch = useDispatch()


  const togglePurchaseList = () => {
      setPurshaseList(prev => !prev);
  }

  window.addEventListener("resize", () => setCarousel(carousel_match.matches));

  const toggleCheckList = () => {
    setOpenCheckList(prev => !prev)
  }

  // const getAllProduct = useCallback(async () => {
  //   if (loginDone) {
  //     if (currentChain === splashData.purchaseButton.requiredBlockchain) {
  //       setSoldCopies((await minterInstance.getOfferRangeInfo(...splashData.purchaseButton.offerIndex)).tokensAllowed.toString());
  //     } else {
  //       setSoldCopies();
  //     }
  //   }

  // }, [setSoldCopies, loginDone, currentChain, minterInstance]);

  // useEffect(() => {
  //   getAllProduct()
  // }, [getAllProduct])

  useEffect(() => {
    dispatch(setRealChain(ukraineglitchChainId))
    //eslint-disable-next-line
  }, []);

  return (
    <div className="wrapper-splash-page vaporverse">
      <MetaTags seoMetaTags={splashData.seoInformation} />
      <div className="template-home-splash-page">
        <ModalHelp 
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          toggleCheckList={toggleCheckList}
          backgroundColor={{darkTheme:"rgb(189,52,183)", lightTheme:"rgb(189,52,183)"}}
        />
        <AuthorCard {...{ splashData, connectUserData, toggleCheckList }} />
        <PurchaseChecklist
          toggleCheckList={toggleCheckList}
          openCheckList={openCheckList}
          nameSplash={"UkraineGlitch"}
          backgroundColor={{ darkTheme: "rgb(3, 91, 188)", lightTheme: "rgb(3, 91, 188)" }}
        />

        <div style={{ height: "5vw" }} />

        <div style={{display: "flex", width:"100%"}}>
          <InfoBlock subclass="info-block-col" infoArray={[
            <>must own</>,
            <>/heavencomputer</>,
            <>/bastardganpunksv1/v2</>,
            <>/glitchpixx</>,
            <div style={{color: "RGB(189,52,182)"}}>---Discord4FullList---</div>,
            <div style={{height: "12px", width: "100%", backgroundColor: "RGB(198,212,131)"}}></div>,
          ]}/>
          <InfoBlock subclass="info-block-col" infoArray={[
            <></>,
            <>/snapshot date 8/19/2022</>,
            <>/1:1 polygon claim token</>,
            <>/convert to ETH @ ETH2.0 launch 2 save treees</>,
            <br/>,
            <div style={{height: "12px", width: "100%", backgroundColor: "white"}}></div>,
          ]}/>
        </div>

        <div style={{ height: "3vw" }} />

        <InfoBlock style={{color: "RGB(213,233,216)"}} infoArray={[
          "mkdir vap0rverse",
          "rmdir vaporverse",
          "//N0stalgia. A permutation. A remix. Warm feelings. The click of high heels on smooth tile.",
          "//Whispers. Whitelist on aisle 8. Tag 3 frens 4 brainchip pass. Give your grankids +80 dopamine for life.",
          "//All is claim. Claim your pass. NO BOOMER PUNKS",
          "time 2 go 2 skool...",
          ].map(text => <Text text={text}/>)}/>
        
        <div style={{ height: "5vw" }} />

        <div style={{display: "flex", width: "100%", justifyContent: "space-evenly"}}>
          <InfoBlock 
            style={{display: "flex", flexDirection: "column", alignItems: "center"}}
            infoArray={[
              <img style={{width: "90%"}} src={VV_warning_2}/>,
              <div style={{textAlign: "center", width: "75%", color:"RGB(117, 251, 81)"}}> //clean safe only challenge </div>
            ]}
          />
          <InfoBlock 
            style={{display: "flex", flexDirection: "column", alignItems: "center"}}
            infoArray={[
              <img style={{width: "90%"}} src={VV_warning_1}/>,
              <div style={{textAlign: "center", width: "75%", color:"RGB(234, 51, 35)"}}> //dirty do not sign will steal yur eth</div>
            ]}
          />
        </div>

        <InfoBlock infoArray={[
          "//transmission failed??",
          "goto metamask",
          "goto opensea",
          "goto looksrare",
          "//buy supported degens",
          "loading....",
          ].map(text => <Text text={text}/>)}/>

        <div style={{ height: "5vw" }} />

        <img style={{width: "100%"}} src={VV_test_transmission}/>

        <div style={{ height: "7vw" }} />

        <InfoBlock infoArray={[
          "//join lore",
          "//moar streaming vapor",
          "awaits...."
        ].map(text => <Text text={text}/>)}/>

        <div style={{ height: "5vw" }} />
        <VideoPlayerModule backgroundImage={videoBackground} videoData={splashData.videoData} />
        <NFTImages
          NftImage={VV0}
          Nft_1={VV1}
          Nft_2={VV2}
          Nft_3={VV3}
          Nft_4={VV4}
          noTitle={true}
          carousel={carousel}
        />


        <div style={{display: "flex", flexDirection:"column"}}>
          <div className="vv_footer1"> RAIR tokens later </div>
          <br/>
          <div className="vv_footer2"> !NO BOOMER PUNKS! </div>
        </div>

        <div style={{ height: "10vw" }} />

        <TeamMeet primaryColor={primaryColor} arraySplash={"vaporverse"} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default VaporverseSplashPage;
