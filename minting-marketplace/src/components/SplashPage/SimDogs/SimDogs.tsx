import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { teamSimDogsArray } from './AboutUsTeam';
import { BackStorySimDogs } from './InformationText';

import { TFileType, TNftFilesResponse } from '../../../axios.responseTypes';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import { discrodIconNoBorder } from '../../../images';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import MetaTags from '../../SeoTags/MetaTags';
import {
  Flyinggreyman,
  GreymanArmy,
  GreymanMatrix,
  GreymanMonument,
  GreymanRose,
  GreyManTimes,
  GreymanVariants
} from '../images/greyMan/grayMan';
import {
  SimDogs0,
  SimDogs1,
  SimDogs2,
  SimDogs3,
  SimDogs4
} from '../images/simDogs/simDogs';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import {
  ICustomButtonBlock,
  ISplashPageProps,
  TDonationGridDataItem,
  TSplashDataType
} from '../splashPage.types';
import CardParagraphText from '../SplashPageConfig/CardParagraphText/CardParagraphText';
import AuthorCard from '../SplashPageTemplate/AuthorCard/AuthorCard';
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';
import DonationGrid from '../SplashPageTemplate/DonationSquares/DonationGrid';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
/* importing Components*/
import TeamMeet from '../TeamMeet/TeamMeetList';
/* importing Components*/
import WarningModal from '../WarningModal/WarningModal';

import favion_SimDogs from './../images/favicons/favicon-simdogs.ico';

import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './SimDogs.css';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const reactSwal = withReactContent(Swal);

const SimDogsSplashPage: React.FC<ISplashPageProps> = ({
  connectUserData,
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);
  /* UTILITIES FOR VIDEO PLAYER VIEW */
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [selectVideo, setSelectVideo] = useState<TFileType>();

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };
  const mainChain = '0x1';
  const splashData: TSplashDataType = useMemo(
    () => ({
      // NFTName: 'Genesis Pass artwork',
      title: 'SIM DOGS',
      titleColor: '#495CB0',
      description: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
      textBottom: false,
      videoPlayerParams: {
        contract: '0xa5a823294af53b983969bb48caa3cdb28545828f',
        product: '0',
        blockchain: '0x1'
      },
      marketplaceDemoParams: {
        contract: '0xa5a823294af53b983969bb48caa3cdb28545828f',
        product: '0',
        blockchain: '0x1'
      },
      purchaseButton: {
        requiredBlockchain: '0x38',
        contractAddress: '0x03041d4fd727eae0337529e11287f6b499d48a4f'
      },
      buttonLabel: 'Connect Wallet',
      buttonBackgroundHelp: 'rgb(3, 91, 188)',
      backgroundImage: SimDogs0,
      button1: {
        buttonImg: discrodIconNoBorder,
        buttonAction: () => window.open('https://discord.gg/pSTbf2yz7V')
      },
      button2: {
        buttonCustomLogo: <i className="fab fa-twitter twitter-logo" />,
        buttonAction: () => window.open('https://twitter.com/SIMDogsXYZ')
      },
      button3: {
        buttonTextColor: '#FFFFFF',
        buttonColor: '#55CFFF',
        buttonLabel: 'Opensea',
        buttonImg: null,
        buttonLink: 'https://opensea.io/collection/sim-dogs'
      },
      exclusiveNft: {
        title: 'NFTs',
        titleColor: 'rgb(3, 91, 188)'
      },
      timelinePics: [
        Flyinggreyman,
        GreymanVariants,
        GreymanMonument,
        GreymanRose,
        GreymanArmy,
        GreymanMatrix,
        GreyManTimes
      ]
    }),
    []
  );

  const donationGridData: TDonationGridDataItem[] = [
    {
      title: 'PROSECUTOR',
      image: SimDogs1,
      imageClass: 'zero',
      buyFunctionality: true,
      offerIndexInMarketplace: '6',
      switchToNetwork: mainChain,
      contractAddress: '0xa5a823294af53b983969bb48caa3cdb28545828f',
      buttonData: {
        buttonTextColor: '#FFFFFF',
        buttonColor: '#384190',
        buttonLabel: 'Mint for 10.7 ETH'
      },
      textBoxArray: [
        '107 unique drawings with various rarity traits',
        '“Bored Ape” style ownership rights',
        '+++',
        '25 free Blockchain Wire press releases (Express circuit)',
        '$15K CoinAgenda sponsorships',
        'One year of free CoinAgenda conference passes (value: $12,000)',
        'Private Zoom updates on trial'
      ]
    },
    {
      title: 'DETECTIVE',
      image: SimDogs4,
      imageClass: 'one',
      buyFunctionality: true,
      offerIndexInMarketplace: '7',
      switchToNetwork: mainChain,
      contractAddress: '0xa5a823294af53b983969bb48caa3cdb28545828f',
      buttonData: {
        buttonTextColor: '#FFFFFF',
        buttonColor: '#006EE9',
        buttonLabel: 'Mint for 1.07 ETH'
      },
      textBoxArray: [
        '1,000 unique pieces of generative art, with various degrees of rarity',
        'Unreleased audio from conversations with convicted SIM swapper',
        '++',
        '10 free Blockchain Wire press releases (Express circuit)',
        'One free CoinAgenda conference pass (value $3,000)'
      ]
    },
    {
      title: 'SUPPORTER',
      image: SimDogs3,
      imageClass: 'one',
      buttonData: {
        buttonAction: () => {
          Swal.fire('Coming soon!');
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: '#51E84D',
        buttonLabel: 'Coming soon'
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
      title: 'SUPREME COURT',
      image: SimDogs2,
      imageClass: 'zero',
      buttonData: {
        buttonAction: () => {
          Swal.fire('Coming soon!');
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: '#FE94FF',
        buttonLabel: 'Coming soon'
      },
      textBoxArray: [
        'Nine unique “1-of-1” original drawings by Andre Miripolsky',
        'Work directly with Miripolsky to design',
        '+++ +',
        '100 free Blockchain Wire press releases (Express circuit)',
        '$150K CoinAgenda sponsorships',
        'Lifetime conference pass to all CoinAgenda conferences',
        'Ten hours of personal meetings with Michael Terpin'
      ]
    }
  ];

  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${splashData.marketplaceDemoParams?.blockchain}/${splashData.marketplaceDemoParams?.contract}/${splashData.marketplaceDemoParams?.product}/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, [splashData]);

  //an option for custom button arrangment
  const CustomButtonBlock: React.FC<ICustomButtonBlock> = ({ splashData }) => {
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

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: 'Sim Dogs',
        ogTitle: 'Sim Dogs',
        twitterTitle: 'Sim Dogs',
        contentName: 'author',
        content: '',
        description: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        ogDescription: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        twitterDescription: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
        image: SimDogs0,
        favicon: favion_SimDogs,
        faviconMobile: favion_SimDogs
      })
    );
  }, [dispatch]);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  useEffect(() => {
    dispatch(setRealChain(mainChain));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrapper-splash-page simdogs">
      <MetaTags seoMetaTags={seo} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
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
        <div className="btn-submit-with-form need-help">
          {/* <button
            className="genesis-font"
            onClick={() =>
              reactSwal.fire({
                title:
                  'Watch out for sign requests that look like this. There are now gasless attack vectors that can set permissions to drain your wallet',
                html: (
                  <WarningModal
                    className="simdogs"
                    bad="bad-simdogs"
                    good="good-simdogs"
                  />
                ),
                customClass: {
                  popup: `bg-${primaryColor} genesis-radius simdog-resp `,
                  title: 'text-simdogs'
                },
                showConfirmButton: false
              })
            }>
            Need Help
          </button> */}
        </div>
        <DonationGrid
          donationGridArray={donationGridData}
          connectUserData={connectUserData}
        />
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
        <CardParagraphText
          fontFamilyTitle={`'Acme', sans-serif`}
          fontWeight={'900'}
          fontAlign={'left'}
          arrayParagragh={BackStorySimDogs}
          title={'BACKSTORY'}
        />
        <TeamMeet
          titleHeadFirst="TEAM"
          classNameHead="splashpage-subtitle above-meet-team"
          arraySplash={'sim-dogs'}
          teamArray={teamSimDogsArray}
        />
        <NotCommercialTemplate primaryColor={primaryColor} NFTName={'NFT'} />
      </div>
    </div>
  );
};

export default SimDogsSplashPage;
