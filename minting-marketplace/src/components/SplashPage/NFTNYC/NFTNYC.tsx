//@ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../SplashPageTemplate/AuthorCard/AuthorCard.css";
import "../../AboutPage/AboutPageNew/AboutPageNew.css";
import "./NFTNYC.css";


// import NFTLA_Video from "../images/NFT-LA-RAIR-2021.mp4"
import MetaMaskIcon from "../images/metamask_logo.png"
import DiscordIcon from '../images/discord-icon.png';
import NFTNYC_TITLE from '../images/NFTNYX_TITLE.gif';
import NFTNYC_favicon from '../images/favicons/NFTNYX_TITLE.ico';
import warning0 from '../images/warning_0.png'
import warning1 from '../images/warning_1.png'
import warning2 from '../images/warning_2.png'
import videoBackground1 from '../images/nftnyc_videobackground1.png'
import videoBackground2 from '../images/nftnyc_videobackground2.png'
import videoBackground3 from '../images/nftnyc_videobackground3.png'


/* importing Components*/
import TeamMeet from "../TeamMeet/TeamMeetList";
import AuthorCard from "../SplashPageTemplate/AuthorCard/AuthorCard";
import NotCommercialTemplate from "../NotCommercial/NotCommercialTemplate";
import VideoPlayerModule from "../SplashPageTemplate/VideoPlayer/VideoPlayerModule";
import NFTImages from "../SplashPageTemplate/NFTImages/NFTImages";
import TokenLeftTemplate from "../TokenLeft/TokenLeftTemplate";
import PurchaseTokenButton from '../../common/PurchaseToken';
import Swal from 'sweetalert2';
import { rFetch } from '../../../utils/rFetch';
import withReactContent from 'sweetalert2-react-content';
import ModalHelp from "../SplashPageTemplate/ModalHelp";
import VideoPlayerView from "../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView";

import axios from 'axios';
import MetaTags from "../../SeoTags/MetaTags";
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const splashData = {
  NFTName: "NFT",
  title: "NFTNYC X RAIR",
  titleColor: "#F15621",
  description: [
    "Connect your wallet to receive a free airdrop. Unlock exclusive encrypted streams"
  ],
  seoInformation: {
    title: "NFTNYC X RAIR",
    contentName: "author",
    content: "NFTNYC X RAIR",
    description: "Claim your NFT to unlock encrypted streams from the NFTLA conference",
    favicon: NFTNYC_favicon,  
    image: NFTNYC_TITLE
  },

  /*  this block needs to be changed */ 
  buttonLabel: "Connect Wallet",
  buttonBackgroundHelp: "rgb(3, 91, 188)",
  backgroundImage: NFTNYC_TITLE,
  purchaseButton: {
    // Reusable component
    buttonComponent: PurchaseTokenButton,
    // OPTIONAL: Image on the purchase button
    img: null,
    // Contract address
    // ...(process.env.REACT_APP_TEST_CONTRACTS === 'true' ? testContract : mainContract),
    // Custom style for the button
    customStyle: {
      backgroundColor: "#F15621"
    },
    presaleMessage: 'Claim your NFT to unlock encrypted streams from the NFTNYC conference',
    // Custom class for the div surrounding the button
    customWrapperClassName: 'btn-submit-with-form',
    blockchainOnly: true,
    // Custom function that will be called if the minting is a success
    // First parameter will be the minted token's number
    customSuccessAction: async (nextToken) => {
      let tokenMetadata = await rFetch(`/api/nft/network/0x1/0xbd034e188f35d920cf5dedfb66f24dcdd90d7804/0/token/${nextToken}`);
      if (tokenMetadata.success && tokenMetadata?.result?.metadata?.image) {
        Swal.fire({
          imageUrl: tokenMetadata.result.metadata.image,
          imageHeight: "auto",
          imageWidth: "65%",
          imageAlt: "Your NFT's image",
          title: `You own #${nextToken}!`,
          icon: "success"
        });
      } else {
        Swal.fire('Success', `Bought token #${nextToken}`, 'success');
      }
    }
  },
  button2: {
    buttonColor: "#000000",
    buttonLabel: "View on Opensea",
    buttonImg: null,
    buttonLink: "https://opensea.io/collection/swagnftnyc",
  },
  exclusiveNft: {
    title: "NFTs",
    titleColor: "rgb(3, 91, 188)",
  },
  videoBackground1: videoBackground1,
  videoData1: {
    video: null,
    videoTitle: "",
    videoModuleDescription: "NFT owners can learn more about the project by signing with metamask to unlock an encrypted stream ",
    videoModuleTitle: "Exclusive 1: Degen Toonz Cartoon",
    // baseURL: 'https://storage.googleapis.com/rair-videos/',
    // mediaId: 'VUPLZvYEertdAQMiZ4KTI9HgnX5fNSN036GAbKnj9XoXbJ',
    demo: true,
  },
}

const reactSwal = withReactContent(Swal);

const WarningModal = () => {
  return (
          <div className="warning-modal">
            <div className="warning-modal-col-0">
              <div className="warning-modal-col-0-title">Bad don't sign</div>
            </div>
            <div className="warning-modal-col-1">
              <div className="warning-modal-col-1-title">Good safe to sign</div>
            </div>
          </div>
        )
      }

const NFTNYCSplashPage = ({ loginDone, connectUserData }) => {

  const { primaryColor } = useSelector((store) => store.colorStore);

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList, setOpenCheckList] = useState(false);
  const [soldCopies, setSoldCopies] = useState(0);
  const { currentChain, minterInstance } = useSelector((store) => store.contractStore);
  const [purchaseList, setPurshaseList] = useState(true);
  const ukraineglitchChainId = '0x1'
  const dispatch = useDispatch()

  const togglePurchaseList = () => {
      setPurshaseList(prev => !prev);
  }

  const getAllProduct = useCallback(async () => {
    if (loginDone) {
      if (currentChain === splashData.purchaseButton.requiredBlockchain) {
        setSoldCopies((await minterInstance.getOfferRangeInfo(...splashData.purchaseButton.offerIndex)).tokensAllowed.toString());
      } else {
        setSoldCopies();
      }
    }

  }, [setSoldCopies, loginDone, currentChain, minterInstance]);

  useEffect(() => {
    getAllProduct()
  }, [getAllProduct])

  useEffect(() => {
    dispatch({type: 'SET_REAL_CHAIN', payload: ukraineglitchChainId})
    //eslint-disable-next-line
  }, []);


  /* UTILITIES FOR VIDEO PLAYER VIEW */
  const [productsFromOffer, setProductsFromOffer] = useState([]);
  const [selectVideo, setSelectVideo] = useState()
 
  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/0x89/0xb41660b91c8ebc19ffe345726764d4469a4ab9f8/0/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, []);
 
  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  /**** */

  return (
    <div className="wrapper-splash-page nftnyc">
      <MetaTags seoMetaTags={splashData.seoInformation} />
      <div className="template-home-splash-page">
        <ModalHelp 
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          // toggleCheckList={toggleCheckList}
          backgroundColor={{ darkTheme: "rgb(3, 91, 188)", lightTheme: "rgb(3, 91, 188)" }}
        />
        <AuthorCard {...{ splashData, connectUserData}} />        
        <div style={{ height: "108px" }} />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h1>How it works</h1>
          <div style={{fontSize: 'calc(.75rem + 1vw)', margin:'24px 0'}}>1.  Export your Kred NFT to Metamask</div>
          <div style={{fontSize: 'calc(.75rem + 1vw)'}}>2. OR just connect your wallet. We’ll mint an unlock NFT in the near future</div>
          <div style={{fontSize: 'calc(.75rem + 1vw)', margin:'24px 0'}}>Click sign. We only ask for a single challenge request.</div>
          <img className="warning-img" src={warning0}/>
          <div className="btn-submit-with-form">
            <button
              onClick={() => reactSwal.fire({
                title: "Watch out for sign requests that look like this. There are now gasless attack vectors that can set permissions to drain your wallet",
                html: <WarningModal/>,
                width: '90vw',
                height: '70vh',
                customClass: {
                  popup: `bg-${primaryColor}`,
                  title: `text-nftnyc`,
                },
                showConfirmButton: false
            })}
              style={{
                background: "#F15621",
              }}
            >
              Need Help?
            </button>
        </div>
        </div>
        <div style={{ height: "108px" }} />
        <VideoPlayerModule backgroundImage={videoBackground1} videoData={splashData.videoData1} />
        <div style={{ height: "108px" }} />
        <div className="info-block"> Unlockable Conferences Videos Coming Soon</div>
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          primaryColor={primaryColor}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
        />
        <div style={{ height: "108px" }} />
        <TeamMeet primaryColor={primaryColor} arraySplash={"nftnyc"} />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={splashData.NFTName}
        />
      </div>
    </div>
  );
};

export default NFTNYCSplashPage;