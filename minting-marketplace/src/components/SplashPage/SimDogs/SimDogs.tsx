//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './SimDogs.css';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';

import warning1 from '../images/warning_1.png';
import warning2 from '../images/warning_2.png';

import MetaMaskIcon from '../images/metamask_logo.png';
import DiscordIcon from '../images/discord-icon.png';
import SimDogs0 from '../images/SimDogs0.png';
import SimDogs1 from '../images/SimDogs1.png';
import SimDogs2 from '../images/SimDogs2.png';
import SimDogs3 from '../images/SimDogs3.png';
import SimDogs4 from '../images/SimDogs4.png';
import NFTNYC_favicon from '../images/favicons/NFTNYX_TITLE.ico';

import pic1 from '../SplashPageTemplate/TimelineGeneric/img/pic1.png';
import pic2 from '../SplashPageTemplate/TimelineGeneric/img/pic2.png';
import pic3 from '../SplashPageTemplate/TimelineGeneric/img/pic3.png';
import pic5 from '../SplashPageTemplate/TimelineGeneric/img/pic5.png';
import pic6 from '../SplashPageTemplate/TimelineGeneric/img/pic6.png';
import pic7 from '../SplashPageTemplate/TimelineGeneric/img/pic7.png';
import pic4 from '../images/greyman.png';
// import GenesisMember from '../images/creator-flow.png';

/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import { NftDataCommonLink } from '../../MockUpPage/NftList/NftData/NftDataCommonLink';
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';

import axios from 'axios';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate2 from '../NotCommercial-2/NotCommercialTemplate-2';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import DonationGrid from '../SplashPageTemplate/DonationSquares/DonationGrid';
import { TimelineGeneric } from '../SplashPageTemplate/TimelineGeneric/TimelineGeneric';
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const reactSwal = withReactContent(Swal);

const WarningModal = () => {
  return (
    <div className="main-wrapper-nyc">
      <div className="bad">
        <h3>Bad don&#8219;t sign</h3>
        <img src={warning1} alt="Bad don&#8219;t sign" />
      </div>
      <div className="good">
        <h3>Good safe to sign</h3>
        <img src={warning2} alt="Good safe to sign" />
      </div>
    </div>
  );
};

const NumberedCircle = ({ index, primaryColor }) => {
  return (
    <div
      className="numbered-circle"
      style={{ color: `${primaryColor === 'rhyno' ? '#000000' : '#FFFFFF'}` }}>
      {index}
    </div>
  );
};

const SimDogsSplashPage = ({ connectUserData, setIsSplashPage }) => {
  const { currentUserAddress } = useSelector((store) => store.contractStore);

  const donationGridData = [
    {
      title: 'PROSECUTOR',
      image: SimDogs1,
      imageClass: 'zero',
      buttonData: {
        buttonAction: () => {
          return;
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: 'rgb(58,65,139)',
        buttonLabel: 'View on Opensea'
      },
      textBoxArray: [
        '100 unique drawings with various rarity traits',
        '“Bored Ape” style ownership rights',
        'Same content categories as Prosecutor, plus video',
        '+++',
        '50 free Blockchain Wire press releases',
        ' One year of free CoinAgenda conference pass (value $12,000)',
        'Private Zoom updates on trial',
        ' '
      ]
    },
    {
      title: 'SUPREME COURT',
      image: SimDogs2,
      imageClass: 'one',
      buttonData: {
        buttonAction: () => {
          return;
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: 'rgb(46, 108, 225)',
        buttonLabel: 'View on Nifty Gateway'
      },
      textBoxArray: [
        'Nine 1-of-1 unique drawings representing caricatures of the actual nine Supreme Court Justices',
        'Work directly with Miripolsky to design',
        '“Bored Ape” style ownership rights',
        '++++',
        '$150,000 of CoinAgenda sponsorships',
        'Lifetime conference pass to all CoinAgendas',
        'In-person meetings with Michael Terpin'
      ]
    },
    {
      title: 'SUPPORTER',
      image: SimDogs3,
      imageClass: 'zero',
      buttonData: {
        buttonAction: () => {
          Swal.fire('Coming soon!');
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: 'rgb(127, 229, 100)',
        buttonLabel: 'Support for .107'
      },
      textBoxArray: [
        '10,000 unique pieces of generative art, with various degrees of rarity',
        '+',
        '1 free Blockchain Wire press release',
        '$250 off any CoinAgenda conference',
        'Video updates on trial',
        'Membership to StopSIMCrimeOrg',
        ' '
      ]
    },
    {
      title: 'DETECTIVE',
      image: SimDogs4,
      imageClass: 'one',
      buttonData: {
        buttonAction: () => {
          Swal.fire('Coming soon!');
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: 'rgb(240, 153, 249)',
        buttonLabel: 'Support for 1.07'
      },
      textBoxArray: [
        '1,000 unique pieces of generative art, with various degrees of rarity',
        'Unreleased audio from these transcripts',
        '++',
        '10 free Blockchain Wire press releases',
        'One free CoinAgenda conference pass (value $3,000)',
        'Video updates on trial'
      ]
    }
  ];
  const splashData = {
    // NFTName: 'Genesis Pass artwork',
    title: 'SIM DOGS',
    subtitle: 'HELP CATCH THE CROOKS AND END SIM CARD JACKING!',
    description: '',
    textBottom: true,
    seoInformation: {
      // title: 'NFT Genesis Pass',
      contentName: 'author',
      // content: 'NFT Genesis Pass',
      description: 'Claim your NFT to unlock encrypted streams',
      // favicon: NFTNYC_favicon,
      image: SimDogs0
    },
    videoPlayerParams: {
      contract: '0x09926100eeab8ca2d636d0d77d1ccef323631a73',
      product: '0',
      blockchain: '0x5'
    },
    marketplaceDemoParams: {
      contract: '0x09926100eeab8ca2d636d0d77d1ccef323631a73',
      product: '0',
      blockchain: '0x5'
    },
    purchaseButton: {
      requiredBlockchain: '0x38',
      contractAddress: '0x03041d4fd727eae0337529e11287f6b499d48a4f'
    },
    buttonLabel: 'Connect Wallet',
    buttonBackgroundHelp: 'rgb(3, 91, 188)',
    backgroundImage: SimDogs0,
    button1: {
      buttonImg: DiscordIcon,
      buttonAction: () => window.open('https://discord.gg/pSTbf2yz7V')
    },
    button2: {
      buttonCustomLogo: <i className="fab fa-twitter twitter-logo" />,
      buttonAction: () => window.open('https://twitter.com/SIMDogsXYZ')
    },
    button3: {
      buttonMarginTop: currentUserAddress === undefined ? 0 : '2vw',
      buttonMarginBottom: currentUserAddress === undefined ? 0 : '6vw',
      buttonBorder: null,
      buttonTextColor: '#FFFFFF',
      buttonColor: 'rgb(120,204,250)',
      buttonLabel: 'PREMINT',
      buttonImg: null,
      buttonLink: 'https://www.premint.xyz/simdogsxyz/'
    },
    exclusiveNft: {
      title: 'NFTs',
      titleColor: 'rgb(3, 91, 188)'
    },
    timelinePics: [pic1, pic2, pic3, pic4, pic5, pic6, pic7]
  };

  //an option for custom button arrangment

  const CustomButtonBlock = ({ splashData }) => {
    const { button1, button2, button3 } = splashData;
    return (
      <div className="button-wrapper">
        <div className="button-row-0">
          <AuthorCardButton buttonData={button1} whatSplashPage={'col-0'} />
          <AuthorCardButton buttonData={button2} whatSplashPage={'col-1'} />
        </div>
        <div className="button-row-1">
          <AuthorCardButton buttonData={button3} whatSplashPage={''} />
        </div>
      </div>
    );
  };

  const customButtonBlock = <CustomButtonBlock splashData={splashData} />;

  const { primaryColor } = useSelector((store) => store.colorStore);

  /* UTILITIES FOR MARKETPLACE DEMO */
  const [mode, setMode] = useState('collection');
  const [tokenId, setTokenId] = useState('0');

  const embeddedParams = {
    ...splashData.marketplaceDemoParams,
    mode: mode,
    setMode: setMode,
    tokenId: tokenId,
    setTokenId: setTokenId
  };

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState(false);
  const [purchaseList, setPurchaseList] = useState(true);
  const ukraineglitchChainId = '0x1';
  const dispatch = useDispatch();

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    dispatch({ type: 'SET_REAL_CHAIN', payload: ukraineglitchChainId });
    //eslint-disable-next-line
  }, []);

  /* UTILITIES FOR VIDEO PLAYER VIEW */
  const [productsFromOffer, setProductsFromOffer] = useState([]);
  const [selectVideo, setSelectVideo] = useState();

  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${splashData.marketplaceDemoParams.blockchain}/${splashData.marketplaceDemoParams.contract}/${splashData.marketplaceDemoParams.product}/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, []);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  /**** */

  return (
    <div className="wrapper-splash-page simdogs">
      <MetaTags seoMetaTags={splashData.seoInformation} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          // toggleCheckList={toggleCheckList}
          backgroundColor={{
            darkTheme: 'rgb(3, 91, 188)',
            lightTheme: 'rgb(3, 91, 188)'
          }}
        />
        <AuthorCard
          {...{
            splashData,
            connectUserData,
            customButtonBlock
          }}
        />
        <div style={{ height: '32px' }} />
        <div className="btn-submit-with-form need-help">
          <button
            className="genesis-font"
            onClick={() =>
              reactSwal.fire({
                title:
                  'Watch out for sign requests that look like this. There are now gasless attack vectors that can set permissions to drain your wallet',
                html: <WarningModal />,
                customClass: {
                  popup: `bg-${primaryColor} genesis-radius genesis-resp `,
                  title: 'text-genesis'
                },
                showConfirmButton: false
              })
            }>
            Need Help?
          </button>
        </div>
        <DonationGrid donationGridArray={donationGridData} />
        {productsFromOffer && productsFromOffer.length > 0 && (
          <>
            <h1
              className="splashpage-subtitle"
              style={{ justifyContent: 'center' }}>
              <div>SUPPORTER ONLY CONTENT</div>
            </h1>
            <VideoPlayerView
              productsFromOffer={productsFromOffer}
              primaryColor={primaryColor}
              selectVideo={selectVideo}
              setSelectVideo={setSelectVideo}
              whatSplashPage={'genesis-font'}
            />
          </>
        )}
        {/* <h1
          className="splashpage-subtitle"
          style={{ marginTop: '150px', marginBottom: '16px' }}>
          {' '}
          CRIME LINE{' '}
        </h1> */}
        {/* <TimelineGeneric timelinePics={splashData.timelinePics} /> */}
        <h1
          className="splashpage-subtitle"
          style={{ marginTop: '150px', marginBottom: '16px' }}>
          {' '}
          ABOUT{' '}
        </h1>
        <TeamMeet primaryColor={primaryColor} arraySplash={'sim-dogs'} />
        <div style={{ height: '900px' }} />
        <NotCommercialTemplate primaryColor={primaryColor} NFTName={'NFT'} />
      </div>
    </div>
  );
};

export default SimDogsSplashPage;
