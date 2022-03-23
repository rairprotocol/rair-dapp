import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./SplashPageTemplate/AuthorCard/AuthorCard.css";
import "./../AboutPage/AboutPageNew/AboutPageNew.css";

/* importing images*/
import NFTLA1_rounded from './images/NFT-LA-Dig-V01-modified.png';
import NFTLA1 from './images/NFT-LA-Dig-V01.jpg';
import NFTLA2 from './images/NFT-LA-Dig-V02.png';
import NFTLA3 from './images/NFT-LA-Dig-V03.png';
import NFTLA_Video from "./images/NFT-LA-RAIR-2021.mp4"
import DocumentIcon from "../../images/documentIcon.svg";
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

// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const splashData = {
  title: "#NFTLA",
  titleColor: "#A4396F",
  description: "Connect with Metamask and receive a free airdrop to unlock exclusive encrypted streams!",
  backgroundImage: NFTLA1_rounded,
  button1 :{
    buttonColor: "#A4396F",
    buttonLabel: "Submit with Form",
    buttonImg: DocumentIcon,
    buttonLink: "https://docs.google.com/forms/d/e/1FAIpQLSeMAtvf2DOMrB05M1lH8ruvKsawEWNqWQOM-1EsQ4w59Nv71A/viewform",
  },
  button2 :{
    buttonColor: "#E6B4A2",
    buttonLabel: "Join Our Discord",
    buttonImg: DiscordIcon,
    buttonLink: "https://discord.com/invite/y98EMXRsCE",
  },
  NFTName: "NFT art",
  carouselData: [
    {
      title: "Horizon",
      img: NFTLA2
    },
    {
      title: "Dark",
      img: NFTLA3
    },
    {
      title: "Palm",
      img: NFTLA1
    }
  ],
  videoData : {
    video: NFTLA_Video,
    videoTitle: "NFT LA",
    videoModuleDescription: "NFT owners can learn more about the project by signing with metamask to unlock an encrypted stream  ",
    videoModuleTitle: "Preview",
  },
  tilesTitle: "Unlockable Conference Videos Coming Soon"
}



const NFTLASplashPage = ({ loginDone }) => {
  const { primaryColor } = useSelector((store) => store.colorStore);
  const carousel_match = window.matchMedia('(min-width: 900px)')
  const [carousel, setCarousel] = useState(carousel_match.matches)
  window.addEventListener("resize", () => setCarousel(carousel_match.matches))
  
  useEffect(() => {
    setTitle(`NFTLA`);
  }, [])

  return (
    <div className="wrapper-splash-page">
      <div className="template-home-splash-page">
        <AuthorCard splashData={splashData}/>
        <CarouselModule carousel={!carousel} carouselData={splashData.carouselData}/>
        <VideoPlayerModule backgroundImage={splashData.backgroundImage} videoData={splashData.videoData}/>
        <StaticTiles title={splashData.tilesTitle} primaryColor={primaryColor} UnlockableVideo={UnlockableVideo}/>
        <TeamMeet primaryColor={primaryColor} arraySplash={"NFTLA"} />
        <NotCommercialTemplate primaryColor={primaryColor} NFTName={splashData.NFTName}/> 
      </div>
    </div>
  );
};

export default NFTLASplashPage;