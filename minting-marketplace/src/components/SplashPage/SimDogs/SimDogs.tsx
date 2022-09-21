import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';
import '../../AboutPage/AboutPageNew/AboutPageNew.css';
import './SimDogs.css';
import '../SplashPageTemplate/AuthorCard/AuthorCard.css';

// import MetaMaskIcon from '../images/metamask_logo.png';
import DiscordIcon from '../images/discord-icon.png';
import SimDogs0 from '../images/SimDogs0.png';
import SimDogs1 from '../images/SimDogs1.png';
import SimDogs2 from '../images/SimDogs2.png';
import SimDogs3 from '../images/SimDogs3.png';
import SimDogs4 from '../images/SimDogs4.png';
// import NFTNYC_favicon from '../images/favicons/NFTNYX_TITLE.ico';

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
import AuthorCardButton from '../SplashPageTemplate/AuthorCard/AuthorCardButton';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';

import axios from 'axios';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import DonationGrid from '../SplashPageTemplate/DonationSquares/DonationGrid';
import {
  ICustomButtonBlock,
  ISplashPageProps,
  TDonationGridDataItem,
  TSplashDataType
} from '../splashPage.types';
import { RootState } from '../../../ducks';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { TFileType, TNftFilesResponse } from '../../../axios.responseTypes';
import { setRealChain } from '../../../ducks/contracts/actions';
import WarningModal from '../WarningModal';
// import { TimelineGeneric } from '../SplashPageTemplate/TimelineGeneric/TimelineGeneric';
// Google Analytics
//const TRACKING_ID = 'UA-209450870-5'; // YOUR_OWN_TRACKING_ID
//ReactGA.initialize(TRACKING_ID);

const reactSwal = withReactContent(Swal);

const SimDogsSplashPage: React.FC<ISplashPageProps> = ({
  connectUserData,
  setIsSplashPage
}) => {
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const donationGridData: TDonationGridDataItem[] = [
    {
      title: 'PROSECUTOR',
      image: SimDogs1,
      imageClass: 'zero',
      buttonData: {
        buttonAction: () => {
          Swal.fire('Coming soon!');
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: '#384190',
        buttonLabel: 'Mint on 9/29'
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
      title: 'SUPREME COURT',
      image: SimDogs2,
      imageClass: 'zero',
      buttonData: {
        buttonAction: () => {
          Swal.fire('Coming soon!');
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: '#006EE9',
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
      title: 'DETECTIVE',
      image: SimDogs4,
      imageClass: 'one',
      buttonData: {
        buttonAction: () => {
          Swal.fire('Coming soon!');
        },
        buttonTextColor: '#FFFFFF',
        buttonColor: '#FE94FF',
        buttonLabel: 'Coming soon'
      },
      textBoxArray: [
        '1,000 unique pieces of generative art, with various degrees of rarity',
        'Unreleased audio from conversations with convicted SIM swapper',
        '++',
        '10 free Blockchain Wire press releases (Express circuit)',
        'One free CoinAgenda conference pass (value $3,000)'
      ]
    }
  ];
  const splashData: TSplashDataType = {
    // NFTName: 'Genesis Pass artwork',
    title: 'SIM DOGS',
    titleColor: '#495CB0',
    description: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
    textBottom: false,
    seoInformation: {
      title: 'Sim Dogs',
      contentName: 'author',
      description: 'BUY A DOG, WIN A LAWSUIT & END SIM SWAP CRIME!',
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
      buttonTextColor: '#FFFFFF',
      buttonColor: '#55CFFF',
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

  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  /* UTILITIES FOR NFT PURCHASE */
  const [openCheckList /*setOpenCheckList*/] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);
  const ukraineglitchChainId = '0x1';
  const dispatch = useDispatch();

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  useEffect(() => {
    dispatch(setRealChain(ukraineglitchChainId));
    //eslint-disable-next-line
  }, []);

  /* UTILITIES FOR VIDEO PLAYER VIEW */
  const [productsFromOffer, setProductsFromOffer] = useState<TFileType[]>([]);
  const [selectVideo, setSelectVideo] = useState<TFileType>();

  const getProductsFromOffer = useCallback(async () => {
    const response = await axios.get<TNftFilesResponse>(
      `/api/nft/network/${splashData.marketplaceDemoParams?.blockchain}/${splashData.marketplaceDemoParams?.contract}/${splashData.marketplaceDemoParams?.product}/files`
    );
    setProductsFromOffer(response.data.files);
    setSelectVideo(response.data.files[0]);
  }, []);

  useEffect(() => {
    getProductsFromOffer();
  }, [getProductsFromOffer]);

  useEffect(() => {
    setIsSplashPage?.(true);
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
          <button
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
        <h1 className="splashpage-subtitle">
          <div>BACKSTORY</div>
        </h1>
        <div className="backstory-text">
          My name is Michael Terpin, and I am an American investor and serial
          entrepreneur.
          {'\n'}
          {'\n'}
          {'\n'}
          On January 7, 2018, I was robbed of $24.7 million in digital assets by
          a criminal gang known variously as “The Community” or “the Pinsky
          Gang” after its 15-year-old ringleader, Ellis Pinsky. The crime would
          not have been possible without the porous security systems and
          improper supervision of employees and contractors at AT&T, which the
          gang was able to penetrate by bribing AT&T store employee Jahmil Smith
          to put false entries into the AT&T computer system indicating that he
          was transferring control of my phone number to me in a store in
          Connecticut, when I was thousands of miles away in Las Vegas. Instead,
          he sent the control of my phone number, which in effect is one’s
          digital identity, without my permission, to the gang members in and
          around New York City. This scenario has happened hundreds, perhaps
          thousands of times, and yet to date AT&T denies any responsibility for
          its role in this blatant assault on personal freedoms, consumer
          privacy and data protection.
          {'\n'}
          {'\n'}
          {'\n'}
          On August 15, 2018, I sued AT&T in Federal Court in Los Angeles for
          $24.7 million in damages, plus $200 million in punitive damages,
          resulting in worldwide attention. AT&T has spent a lot of time and
          money trying to bury me in paperwork and motions, but the case has
          proceeded to depositions and to a docketed trial date in Los Angeles
          in May, 2023.
          {'\n'}
          {'\n'}
          {'\n'}
          This NFT sale is designed to help me continue the fight, no matter how
          long it takes (I’ve been at this for nearly five years and have spent
          over $3 million in attorneys fees to date). I also want attention to
          my case, as well as to the lack of regulation and protection of
          consumers, which I first pursued with an open letter the Federal
          Federal Communications Commission (FCC) in October, 2019 (and my case
          was mentioned in currently proposed rule changes put forth in 2021 to
          protect consumers – which AT&T is fighting).
          {'\n'}
          {'\n'}
          {'\n'}
          To the best of my knowledge, this is the first NFT series designed by
          a plaintiff in a federal lawsuit, and I recognize the power of
          community and digital assets in hoping this will bring forth a new
          generation of cause-related NFTs in the world of law and politics.
          {'\n'}
          {'\n'}
          {'\n'}
          The SIM Dog series was designed by renowned pop artist Andre
          Miripolsky (see bio below) and features four distinct NFT series,
          which are described below. Please join us in supporting this
          groundbreaking case and project.
        </div>
        <h1 className="splashpage-subtitle above-meet-team"> TEAM </h1>
        <TeamMeet arraySplash={'sim-dogs'} />
        <NotCommercialTemplate primaryColor={primaryColor} NFTName={'NFT'} />
      </div>
    </div>
  );
};

export default SimDogsSplashPage;
