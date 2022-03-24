import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./SplashPageTemplate/AuthorCard/AuthorCard.css";
import "./../AboutPage/AboutPageNew/AboutPageNew.css";

/* importing images*/
import UKR_rounded from './images/UkraineGlitchNFTExamples/rounded_corners.png';
import UKR4 from './images/UkraineGlitchNFTExamples/4.jpg'
import UKR5 from './images/UkraineGlitchNFTExamples/5.gif'
import UKR126 from './images/UkraineGlitchNFTExamples/126.jpg'
import UKR246 from './images/UkraineGlitchNFTExamples/246.jpg'
import UKR497 from './images/UkraineGlitchNFTExamples/497.jpg'
import UKR653 from './images/UkraineGlitchNFTExamples/653.jpg'
import UKR777 from './images/UkraineGlitchNFTExamples/777.jpg'
import UKR1050 from './images/UkraineGlitchNFTExamples/1050.jpg'
import UKR1294 from './images/UkraineGlitchNFTExamples/1294.jpg'
import UKR1518 from './images/UkraineGlitchNFTExamples/1518.jpg'
import UKR1641 from './images/UkraineGlitchNFTExamples/1641.jpg'
import UKR1896 from './images/UkraineGlitchNFTExamples/1896.jpg'
import UKR1989 from './images/UkraineGlitchNFTExamples/1989.jpg'


import NFTLA_Video from "./images/NFT-LA-RAIR-2021.mp4"
import MetaMaskIcon from "./images/metamask_logo.png"
import DiscordIcon from './images/discord-icon.png';


/* importing Components*/
import TeamMeet from "./TeamMeet/TeamMeetList";
import AuthorCard from "./SplashPageTemplate/AuthorCard/AuthorCard";
import setTitle from '../../utils/setTitle';
import NotCommercialTemplate from "./NotCommercial/NotCommercialTemplate";
import CarouselModule from "./SplashPageTemplate/Carousel/Carousel";
import VideoPlayerModule from "./SplashPageTemplate/VideoPlayer/VideoPlayerModule";
import StaticTiles from "./SplashPageTemplate/VideoTiles/StaticTiles";
import UnlockableVideo from "./images/nipsey1.png";
import NFTCounter from "./SplashPageTemplate/NFTCounter/NFTCounter";
import MobileCarouselNfts from "../AboutPage/AboutPageNew/ExclusiveNfts/MobileCarouselNfts";

// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const splashData = {
  title: "#UkraineGlitch",
  titleColor: "#FFD505",
  description: ["1991 generative pixelated glitch art pieces represent pseudo random shelling, aimless fire, a flag in distress ", <br/>,<br/>, "100% of proceeds fund tactical first aid supplies and Ukrainian developers"],
  backgroundImage: UKR_rounded,
  button1 :{
    buttonColor: "#035BBC",
    buttonLabel: "Mint for .1 ETH",
    buttonImg: MetaMaskIcon,
    buttonLink: "https://placekitten.com/200/300",
  },
  button2 :{
    buttonColor: "#FFD505",
    buttonLabel: "Join Our Discord",
    buttonImg: DiscordIcon,
    buttonLink: "https://discord.com/invite/y98EMXRsCE",
  },
  carouselTitle: "Our Developers",
  carouselData: [
    {
      title: "Alex & Arsenii",
      img: UKR126,
      description: "Originally based in Kharkiv, Alex and Arsenii are experienced frontend REACT developers that created the site you see here"
    },
    {
      title: "Masha",
      img: UKR497,
      description: "Born in Odessa, Masha emigrated with her family to the US when she was a small child. They remained closely connected to the Post-Soviet immigrant community of the Pacific NW while growing up. She created these pieces of glitch art as a way to process the grief of a country in dispair, and to continue funding the shipment of medical supplies to the war-torn area."
    },
    {
      title: "Valerii & Natalia",
      img: UKR1294,
      description: "Originally based in Kharkiv, Valerii and Natalia are respsonsible for backend database architecture and syncing to allow for seemless purchase"
    }
  ],
  videoData : {
    video: null,
    videoTitle: "Watch the Transformation",
    videoModuleDescription: "Flag owners sign in with metamask to watch",
    videoModuleTitle: "Coming Soon",
  },
  tilesTitle: null,
  NFTName: "#ukraineglitch",
  counterData: {
    titleColor: "#FFD505" ,
    title1: "#ukraineglitch",
    title2: "origins",
    backgroundImage: `url(${UKR246})`,
    description: ["This (de)generative art project was created to provide 100% direct aid to Ukraine.", <br/>,<br/>, "2014", <br/>, "Ukrainian immigrants in the Pacific Northwest of the United States had taken it into their own hands to provide a direct supply chain of specialty tactical medical equipment to Ukraine’s grassroots militias. We are here to continue their story.", <br/>,<br/>, "2022",<br/>, "This website was built by Ukrainian Web3 developers. The logic of the algorithm written by a Ukranian generative artist. Prior to the war they were making NFTs for fun, now for a purpose.", <br/>,<br/>, "About the piece",<br/>,"The algorithm is set such that as the number of the NFT increases, the chaotic opposite square masses also increase, eventually inverting or turning the flag upside-down. Some NFTs are animated (sparkling) to show parts of this progression, and others are still. Only holders of a UkraineGlitch NFT can watch the full animation of the flag transformation occur below."]
  }

}



const UkraineSplashPage = ({ loginDone }) => {
  const { primaryColor } = useSelector((store) => store.colorStore);
  const carousel_match = window.matchMedia('(min-width: 900px)')
  const [carousel, setCarousel] = useState(carousel_match.matches)
  window.addEventListener("resize", () => setCarousel(carousel_match.matches))
  
  useEffect(() => {
    setTitle(`#UkraineGlitch`);
  }, [])

  return (
    <div className="wrapper-splash-page">
      <div className="template-home-splash-page">
        <AuthorCard splashData={splashData}/>
        <NFTCounter primaryColor={"rhyno"} leftTokensNumber={0} wholeTokens={0} counterData={splashData.counterData}/>
        <div className="main-greyman-pic-wrapper">
              <>
                <div className="main-greyman-pic">
                  <div className="join-pic-main">
                    <div className="show-more-wrap">
                      <span className="show-more" style={{ color: "#fff" }}>
                        Coming Soon <i className="fas fa-arrow-right"></i>{" "}
                      </span>
                    </div>
                    <img
                      className="join-pic-main-img"
                      src={UKR5}
                      alt="community-img"
                    />
                  </div>
                </div>
                <div className="list-of-greymans-pic">
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={UKR497}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={UKR1989}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={UKR4}
                      alt="community-img"
                    />
                  </div>
                  <div className="join-pic">
                    <img
                      className="join-pic-img"
                      src={UKR126}
                      alt="community-img"
                    />
                  </div>
                </div>
              </>
            <>
              <div className="exclusive-nfts">
                <MobileCarouselNfts>
                  <img
                    className="join-pic-img"
                    src={UKR497}
                    alt="community-img"
                  />
                  <img
                    className="join-pic-img"
                    src={UKR1989}
                    alt="community-img"
                  />
                  <img
                    className="join-pic-img"
                    src={UKR4}
                    alt="community-img"
                  />
                  <img
                    className="join-pic-img"
                    src={UKR126}
                    alt="community-img"
                  />
                </MobileCarouselNfts>
              </div>
            </>
        </div>
        <div style={{height:"108px"}}/>
        <VideoPlayerModule backgroundImage={splashData.backgroundImage} videoData={splashData.videoData}/>
        {/* <StaticTiles title={splashData.tilesTitle} primaryColor={primaryColor} UnlockableVideo={UnlockableVideo}/> */}
        <CarouselModule carousel={!carousel} carouselData={splashData.carouselData}/>
        <TeamMeet primaryColor={primaryColor} arraySplash={"ukraine"} />
        <NotCommercialTemplate primaryColor={primaryColor} NFTName={splashData.NFTName}/> 
      </div>
    </div>
  );
};

export default UkraineSplashPage;