//@ts-nocheck
import React, { useState /*, useEffect*/ } from "react";
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
import NFTfavicon from './images/NFT_favicon.ico';


/* importing Components*/
import TeamMeet from "./TeamMeet/TeamMeetList";
import AuthorCard from "./SplashPageTemplate/AuthorCard/AuthorCard";
// import setTitle from '../../utils/setTitle';
import NotCommercialTemplate from "./NotCommercial/NotCommercialTemplate";
import CarouselModule from "./SplashPageTemplate/Carousel/Carousel";
import VideoPlayerModule from "./SplashPageTemplate/VideoPlayer/VideoPlayerModule";
// import StaticTiles from "./SplashPageTemplate/VideoTiles/StaticTiles";
// import UnlockableVideo from "./images/white_pixel.png";
import MetaTags from "../SeoTags/MetaTags";
import VideoTiles from "./SplashPageTemplate/VideoTiles/VideoTiles";

// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const splashData = {
  title: "#NFTLA",
  titleColor: "#A4396F",
  description: "Connect with Metamask for your free NFT airdrop and access exclusive streaming content from our event!",
  seoInformation: {
    title: "Official NFTLA Streaming NFTs",
    contentName: "author",
    content: "#NFTLA",
    description: "Claim your NFT to unlock encrypted streams from the NFTLA conference",
    favicon: NFTfavicon,
    faviconMobile: NFTfavicon
  },
  backgroundImage: NFTLA1_rounded,
  button1: {
    buttonColor: "#A4396F",
    buttonLabel: "Submit with Form",
    buttonImg: DocumentIcon,
    buttonLink: "https://docs.google.com/forms/d/e/1FAIpQLSeMAtvf2DOMrB05M1lH8ruvKsawEWNqWQOM-1EsQ4w59Nv71A/viewform",
  },
  button2: {
    buttonColor: "#E6B4A2",
    buttonLabel: "Join Our Discord",
    buttonImg: DiscordIcon,
    buttonLink: "https://discord.com/invite/y98EMXRsCE",
  },
  NFTName: "NFT art",
  carouselTitle: "3 Unique Styles",
  carouselData: [
    {
      title: "Horizon",
      img: NFTLA2,
      description: null
    },
    {
      title: "Dark",
      img: NFTLA3,
      description: null
    },
    {
      title: "Palm",
      img: NFTLA1,
      description: null
    }
  ],
  videoData: {
    video: NFTLA_Video,
    videoTitle: "NFT LA",
    videoModuleDescription: "Want to learn more about the project? Only NFT owners get access to exclusive streaming content. Connect with Metamask and get yours today!",
    videoModuleTitle: "Preview",
    demo: true,
  },
  videoTilesTitle: "NFTLA",
  videoArr: [
    {
      videoName: "Welcome to NFTLA",
      videoType: "NFTLA-EXCLUSIVE-1",
      videoTime: "00:00:26",
      videoSRC: NFTLA_Video,
      demo: true,
    },
    {
      videoName: "NFTs and Hollywood",
      videoType: "NFTLA-EXCLUSIVE-2",
      videoTime: "02:21.38",
      videoSRC: null,
      baseURL: 'https://storage.googleapis.com/rair-videos/',
      mediaId: 'YOyAaCOt8xrOt-NcvffXR7g0ibX5kJ2w21yGHR1XKOPMEY',
    },
    {
      videoName: "Orange Comet",
      videoType: "NFTLA-EXCLUSIVE-3",
      videoTime: "32:00.58",
      videoSRC: null,
      baseURL: 'https://storage.googleapis.com/rair-videos/',
      mediaId: 'Zosxmne0LRAu2TxEMU5A0WMg8-msfHqvxGws9osGnu4yxL',
    },
    {
      videoName: "Web 3 Convergence",
      videoType: "NFTLA-EXCLUSIVE-4",
      videoTime: "30:46.31",
      videoSRC: null,
      baseURL: 'https://storage.googleapis.com/rair-videos/',
      mediaId: 'pZJJmq9rR6HC1jPxy-RpVvutfTYMtyAGRb2DDnMdTTIlhA'
    }
  ],
}



const NFTLASplashPage = ({ loginDone }) => {
  const { primaryColor } = useSelector((store) => store.colorStore);
  const carousel_match = window.matchMedia('(min-width: 900px)')
  const [carousel, setCarousel] = useState(carousel_match.matches)
  window.addEventListener("resize", () => setCarousel(carousel_match.matches))

  // useEffect(() => {
  //   setTitle(`NFTLA`);
  // }, [])

  return (
    <div className="wrapper-splash-page">
      <MetaTags seoMetaTags={splashData.seoInformation} />
      <div className="template-home-splash-page">
        <AuthorCard splashData={splashData} />
        <CarouselModule 
          carousel={!carousel} 
          carouselTitle={splashData.carouselTitle} 
          carouselData={splashData.carouselData} 
        />
        <VideoPlayerModule 
          backgroundImage={splashData.backgroundImage} 
          videoData={splashData.videoData} 
        />
        <VideoTiles 
          title={splashData.videoTilesTitle} 
          videoArr={splashData.videoArr} 
          primaryColor={primaryColor} 
          backgroundImage={splashData.backgroundImage}
        />
        <TeamMeet primaryColor={primaryColor} arraySplash={"NFTLA"} />
        <NotCommercialTemplate primaryColor={primaryColor} NFTName={splashData.NFTName} />
      </div>
    </div>
  );
};

export default NFTLASplashPage;